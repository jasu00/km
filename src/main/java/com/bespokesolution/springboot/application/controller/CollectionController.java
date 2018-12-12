package com.bespokesolution.springboot.application.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.IteratorUtils;
import org.bson.Document;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bespokesolution.dbmanager.MongoManager;
import com.bespokesolution.model.ApplicationContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;

@RestController
@CrossOrigin
public class CollectionController {

	@RequestMapping("/collection/{collectionName}")
	public String crosstrack(@PathVariable("collectionName") String collectionName){
		
		String response ="";
		try {
			BasicDBObject whereQuery = BasicDBObject.parse("{active:\"Y\",collName:\""+collectionName+"\"}");
			Document doc =MongoManager.getCollection(ApplicationContext.COLLECTION_PARAM_COLLECTION).find(whereQuery).first();
			
			//Default Objects created
			BasicDBObject findQuery=BasicDBObject.parse("{active:\"Y\"}");
			BasicDBObject sortQuery=BasicDBObject.parse("{_id:1}");
			BasicDBObject projectionQuery=BasicDBObject.parse("{_id:0}");
			
			if(doc!=null)
			{
				if(doc.getString("find")!=null)
					findQuery = BasicDBObject.parse(doc.getString("find"));
				if(doc.getString("sort")!=null)
					sortQuery = BasicDBObject.parse(doc.getString("sort"));
				if(doc.getString("projection")!=null)
					projectionQuery = BasicDBObject.parse(doc.getString("projection"));
			}
			
			FindIterable<Document> results = MongoManager.getCollection(collectionName).find(findQuery).sort(sortQuery).projection(projectionQuery);
			
			response = new ObjectMapper().writeValueAsString(IteratorUtils.toList(results.iterator()));
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		
		return response;
	}
	
	@RequestMapping("/calendar/{team}")
	public String calendarCollection(@PathVariable("team") String team, @RequestParam(value = "start", required = true) String sdate, @RequestParam(value = "end", required = true) String edate){
		
		String response ="Response Not Generated";
		ArrayList<Document> finalResult =  new ArrayList<Document>();
		try {
			
			//db.getCollection('context').aggregate([{$match:{active:"Y",name:"calendar_sources"}},{$group:{_id:"$value.config"}},{$unwind:"$_id"}])
			BasicDBObject matchQuery = BasicDBObject.parse("{$match:{active:\"Y\",name:\"calendar_sources\"}}");
			BasicDBObject groupQuery = BasicDBObject.parse("{$group:{_id:\"$value."+team+"\"}}");
			BasicDBObject unwindQuery = BasicDBObject.parse("{$unwind:\"$_id\"}");
			List pipeline = new ArrayList<BasicDBObject>();
			pipeline.add(matchQuery);
			pipeline.add(groupQuery);
			pipeline.add(unwindQuery);
			ArrayList<Document> sources = new ArrayList<>();
			MongoManager.getCollection(ApplicationContext.CONTEXT_COLLECTION).aggregate(pipeline).into(sources);
			
			
			for(Document collName : sources)
			{
				String collectionName = collName.getString("_id");
				
				BasicDBObject whereQuery = BasicDBObject.parse("{active:\"Y\",collName:\""+collectionName+"\"}");
				Document doc =MongoManager.getCollection(ApplicationContext.COLLECTION_PARAM_COLLECTION).find(whereQuery).first();
				
				BasicDBObject findQuery=BasicDBObject.parse("{active:\"Y\"}");
				BasicDBObject sortQuery=BasicDBObject.parse("{_id:1}");
				BasicDBObject projectionQuery=BasicDBObject.parse("{_id:0}");
				
				if(doc!=null)
				{
					if(doc.getString("find")!=null)
						findQuery = BasicDBObject.parse(doc.getString("find"));
					if(doc.getString("sort")!=null)
						sortQuery = BasicDBObject.parse(doc.getString("sort"));
					if(doc.getString("projection")!=null)
						projectionQuery = BasicDBObject.parse(doc.getString("projection"));
				}
				BasicDBList orList = new BasicDBList();
				orList.add(BasicDBObject.parse("{start:{\"$gte\":\""+sdate+"\",\"$lte\":\""+edate+"\"}}"));
				orList.add(BasicDBObject.parse("{end:{\"$gte\":\""+sdate+"\",\"$lte\":\""+edate+"\"}}"));
				
				findQuery.append( "$or", orList );
				
				FindIterable<Document> results = MongoManager.getCollection(collectionName).find(findQuery).sort(sortQuery).projection(projectionQuery);
				
				finalResult.addAll(IteratorUtils.toList(results.iterator()));
				
			}
			response = new ObjectMapper().writeValueAsString(finalResult);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		//System.out.println("Start date of month" + sdate + "end date " + edate);
		return response;
	}
}
