### *Piotr Kłeczek*

----

### Zadanie 1
#### Konfiguracja
Laptop Acer Extensa 5630EZ z procesorem [Intel® Pentium® Processor T4200(1M Cache, 2.00 GHz, 800 MHz FSB)](http://ark.intel.com/pl/products/37251/Intel-Pentium-Processor-T4200-1M-Cache-2_00-GHz-800-MHz-FSB) oraz 2GB ramu.

System Ubuntu 12.04 LTS 64-bitowy

##### MongoDB
```sh
$ mongo --version
MongoDB shell version: 2.4.8
```


#### 1a) Import *Train.csv*

##### Przygotowanie danych
```sh
$ time ./prepareData.sh Train1.csv Train.csv
real    15m14.076s
user    0m42.700s
sys 	1m57.932s
```
##### Import
```sh
$ time mongoimport -db train -c train -type csv -file Train.csv --headerline
Tue Nov  5 21:26:51.082 imported 6034195 objects

real    12m4.822s
user    2m38.012s
sys     0m25.052s
```
##### Obciążenie podczas importu
![htop](../../images/pkleczek/import.png)

##### Rozmiar bazy
```sh
$ mongo
MongoDB shell version: 2.4.8
connecting to: test
> show dbs
local   0.078125GB
train   11.9482421875GB
```

##### Wykresy MMS

![MMS](../../images/pkleczek/mongostats.png)

#### 1b) Liczba zaimportowanych rekordów
```sh
$ mongo
MongoDB shell version: 2.4.8
connecting to: test
> use train
switched to db train
> db.train.count()
6034195
```

#### 1c) Zamiana formatu oraz zliczanie tagów
Napisałem program w Javie, użyłem mongo-java-driver-2.11.3.jar
##### Zad1c.java
```java
package mongo1c;

import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.MongoClient;

public class Zad1c {

	public static void main(String[] args) throws UnknownHostException {
		
		int allTags = 0;
		String objTags[];
		Map<String, Boolean> uniqueTags = new HashMap<String, Boolean>();
		long time1,time2;
		
		time1 = System.currentTimeMillis()/1000;
		MongoClient mongoClient = new MongoClient("localhost", 27017);
		DB db = mongoClient.getDB("train");		
		DBCollection coll = db.getCollection("train");
		
		DBCursor cursor = coll.find();
		try {
			while(cursor.hasNext()) {
				BasicDBObject obj = (BasicDBObject)cursor.next();
				objTags = obj.getString("tags").split(" ");
				obj.put("tags", objTags);
				coll.save(obj);
				
				allTags += objTags.length;
				for(int i=0;i<objTags.length;i++) {
					if(uniqueTags.get(objTags[i]) == null)
						uniqueTags.put(objTags[i], true);
				}
			}
		} finally {
			time2 = System.currentTimeMillis()/1000;
			System.out.println("Wszystkie tagi: "+allTags);
			System.out.println("Unikalne tagi: "+uniqueTags.size());
			System.out.println("Przetwarzanie zajęło "+(time2-time1)/60+"m "+(time2-time1)%60+"s");
			cursor.close();
		}
		
		mongoClient.close();
	}

}
```
##### Obciążenie podczas działania

![htop1c](../../images/pkleczek/htop1c.png)

##### Wynik
```sh
Wszystkie tagi: 29370102
Unikalne tagi: 100779
Przetwarzanie zajęło 64m 35s
```

#### 1d) Statystyki z pliku text8

##### Import
```sh
tr --squeeze-repeats '[:blank:]' '\n' < text8 > text8.txt
time mongoimport -c Text --type csv --file text8.txt --fields word
...
Sun Nov 17 18:02:32.458 check 9 17005207
Sun Nov 17 18:02:33.644 imported 17005207 objects

real	11m40.764s
user	1m7.788s
sys	0m13.404s
```

##### Zliczanie wszystkich wyrazów oraz różnych wyrazów
```sh
quak@Extensa-5630:~/nosql/zad1$ mongo
MongoDB shell version: 2.4.8
connecting to: test
> db.Text.count()
17005207
> db.Text.distinct("word").length
253854
```

##### Zliczanie udziału procentowego najczęściej występujących wyrazów (napisałem program w Javie)
```java
package mongo1d;

import java.net.UnknownHostException;

import com.mongodb.AggregationOutput;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

public class Zad1d {

	private static int getCount(DBCollection coll, int limit) {
		DBObject groupFields = new BasicDBObject("_id", "$word");
		groupFields.put("count", new BasicDBObject("$sum", 1));
		DBObject group = new BasicDBObject("$group", groupFields);
		DBObject sort = new BasicDBObject("$sort", new BasicDBObject("count", -1));
		DBObject limit1 = new BasicDBObject("$limit", limit);
		DBObject countFields = new BasicDBObject("_id", null);
		countFields.put("count", new BasicDBObject("$sum", "$count"));
		DBObject count = new BasicDBObject("$group", countFields);
		AggregationOutput output = coll.aggregate(group, sort, limit1, count);
		
		BasicDBList list = new BasicDBList();
		list = (BasicDBList) output.getCommandResult().get("result");
		BasicDBObject result = new BasicDBObject();
		result = (BasicDBObject) list.get(0);
		return result.getInt("count");
	}
	
	public static void main(String[] args) throws UnknownHostException {
		
		MongoClient mongoClient = new MongoClient("localhost", 27017);
		DB db = mongoClient.getDB("test");
		DBCollection coll = db.getCollection("Text");
		
		int count = (int) coll.getCount();
		double result;
		
		result = getCount(coll,1);
		System.out.println("Top 1: " + (int)result + " / " + count + " = " + result/count*100 + "%");
		result = getCount(coll,10);
		System.out.println("Top 10: " + (int)result + " / " + count + " = " + result/count*100 + "%");
		result = getCount(coll,100);
		System.out.println("Top 100: " + (int)result + " / " + count + " = " + result/count*100 + "%");
		result = getCount(coll,1000);
		System.out.println("Top 1000: " + (int)result + " / " + count + " = " + result/count*100 + "%");
		
		mongoClient.close();
	}

}
```
##### Wynik
```sh
Top 1: 1061396 / 17005207 = 6.241594118789616%
Top 10: 4205965 / 17005207 = 24.733394894869555%
Top 100: 7998978 / 17005207 = 47.03840417820259%
Top 1000: 11433354 / 17005207 = 67.23443001899359%
```