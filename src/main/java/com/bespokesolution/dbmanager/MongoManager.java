package com.bespokesolution.dbmanager;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class MongoManager{

	private static MongoClient mongoClient = new MongoClient(new MongoClientURI("mongodb://"+MongoConstants.MONGO_USER+":"+MongoConstants.MONGO_PASS+"@"+MongoConstants.MONGO_SERVER+":"+MongoConstants.MONGO_PORT+"/"+MongoConstants.MONGO_DB));
	
	private static MongoDatabase db = mongoClient.getDatabase(MongoConstants.MONGO_DB);
	
	
	public static MongoDatabase getConnection()
	{
		return db;
	}
	
	public static MongoCollection<Document> getCollection(String collection)
	{
		return db.getCollection(collection);
	}
}