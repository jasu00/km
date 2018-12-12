package com.bespokesolution.service;

import org.bson.Document;

import com.bespokesolution.dbmanager.MongoManager;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBObject;

public class MenuService {

	public static String getMenuList() {
		
		String menuList="Not Generated";
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			BasicDBObject whereQuery = new BasicDBObject();
			whereQuery.put("name", "menus");
			
			Document document =MongoManager.getCollection("context").find(whereQuery).first();
			menuList = mapper.writeValueAsString(document.get("value"));
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return menuList;
	}
	
}
