package com.bespokesolution.model;

import java.util.HashMap;

import org.bson.Document;
import org.springframework.scheduling.annotation.Scheduled;

import com.bespokesolution.dbmanager.MongoManager;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoIterable;

public class ApplicationContext {

	public static final String COLLECTION_PARAM_COLLECTION = "collection_param";
	public static final String CONTEXT_COLLECTION = "context";
	
	private static HashMap<String, String> context=new HashMap<>();
	
	private ApplicationContext() {
		
	}
	
	static {
			loadContext();
	}
	
	@Scheduled(fixedRate = 900000  , initialDelay=900000)
	public static void loadContext()
	{
		BasicDBObject whereQuery = new BasicDBObject();
		whereQuery.put("active", "Y");
		
		MongoIterable<Document> results= MongoManager.getCollection(CONTEXT_COLLECTION).find(whereQuery);
		
		for (Document document : results) {
			try {
				context.put(document.getString("name"), document.getString("value"));						
			}
			catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	public static String get(String key) {
		if(context!=null)
			return context.get(key);
		return "Context is Empty";
	}
}
