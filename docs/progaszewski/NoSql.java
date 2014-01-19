package nosql;

import java.net.UnknownHostException;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

public class NoSql {
	public static void main(String[] args) {
		try {

			long checkCount = 0;
			//Polaczenie sie z lokalna baza mongodb, domyslnie localhost:27017
			//MongoClient mc = new MongoClient("localhost", 27017);
			MongoClient mc = new MongoClient();
			DB dbNosql = mc.getDB("nosql");

			DBCollection cTrain = dbNosql.getCollection("Train");

			System.out.println(cTrain.count());

			DBCursor cur = cTrain.find();

			long startTime = System.currentTimeMillis();

			DBObject rec;
			DBObject updateRec = new BasicDBObject();

			while(cur.hasNext()){
				try{
					rec = cur.next();

					for(String key : rec.keySet()){
						Object val = rec.get(key);
						if(key.equals("Tags")){
							String[] aTags = ((String)val).split(" ");
							val = aTags;
						}

						updateRec.put(key, val);
					}

					cTrain.update(rec, updateRec);
					checkCount++;
				}catch(Exception e){
					//e.printStackTrace();
				}
			}

			cur.close();

			long time = System.currentTimeMillis() - startTime;
			System.out.println("Czas dziaania: " + ((double)time)/1000.0 + "s");
			System.out.println("Przetworzono: " + checkCount + " rekordow.");

		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
