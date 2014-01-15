package main;

import java.math.BigInteger;
import java.net.UnknownHostException;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

public class Test {
	public static void main(String[] args) {
		try {
	        MongoClient mc = new MongoClient("localhost", 27017);
			BigInteger checkCount = new BigInteger("0");			
			DB db = mc.getDB("db");

			DBCollection trainCollection = db.getCollection("train");

			DBCursor cursor = trainCollection.find();
			long startTime = System.currentTimeMillis();

			DBObject rec;
			DBObject updateRec = new BasicDBObject();

			while (cursor.hasNext()) {
				try {
					rec = cursor.next();

					for (String key : rec.keySet()) {
						Object value = rec.get(key);
						if (key.equals("Tags")) {
							String[] tags = ((String) value).split(" ");
							value = tags;
						}

						updateRec.put(key, value);
					}

					trainCollection.update(rec, updateRec);
					checkCount.add(new BigInteger("1"));
					
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

			cursor.close();

			long time = System.currentTimeMillis() - startTime;
			System.out.println("Time: " + ((double) time) / 1000.0 + "s");
			System.out.println("Records updated: " + checkCount);

		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}
}