package com.bespokesolution.springboot.application.controller;

import java.io.StringReader;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bespokesolution.dbmanager.ConnectionManager;
import com.bespokesolution.dbmanager.MongoManager;
import com.bespokesolution.model.ValidationMessage;
import com.bespokesolution.util.Utility;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoIterable;

import freemarker.template.Template;

@RestController
@CrossOrigin
public class SystemValidatorController {

	
	@RequestMapping("/validate")
	public String validate(){
		String response ="Response Not Generated";
		ArrayList<ValidationMessage> msgList = new ArrayList<ValidationMessage>();
		
		BasicDBObject whereQuery = new BasicDBObject("type", "SYSTEM_VALIDATION").append("active", "Y");
		BasicDBObject sortQuery = new BasicDBObject("order", 1);
		MongoIterable<Document> results =MongoManager.getCollection("validation").find(whereQuery).sort(sortQuery);
		
		Connection conn = null;
		try {
			for (Document doc : results)
			{
				StringWriter out = null;
				Template template =null;
				
				PreparedStatement stmt = null;
				ResultSet rs = null;
				ValidationMessage msg = null;
				try {
					
					String msgTemplate = doc.getString("msg");
					String sqlCheck = doc.getString("sql");
					Integer threshold = doc.getInteger("threshold",0);	
				
					conn = ConnectionManager.getConnection(doc.getString("db"));
					stmt = conn.prepareStatement(sqlCheck);
				
					rs = stmt.executeQuery();
					
					if(rs!=null)
					{
						List<Map<String, Object>> templateResultList = Utility.resultSetToList(rs);
						
						if(templateResultList.size()>threshold)
						{
							HashMap<String,List<Map<String,Object>>> teamplateData = new HashMap<>();
							template = new Template("templateName", new StringReader(msgTemplate), Utility.cfg);
							out = new StringWriter();
							
							teamplateData.put("resultList",  templateResultList);
							template.process(teamplateData, out);
							
							msg = new ValidationMessage();
							msg.setCode(doc.getString("code"));
							msg.setPBI(doc.getString("pbi"));
							msg.setThreshold(threshold);
							msg.setCount(templateResultList.size());
							msg.setMessage(out.toString());
							msg.setxTeam(doc.getString("xteam"));
							msg.setSqlCheck("<div style='width: 300.0px;height: 100.0px;overflow: auto;'>"+sqlCheck+"</div>");
							
							msgList.add(msg);
						}
					}
					
				}catch (Exception e) {
					e.printStackTrace();
				}finally {
					ConnectionManager.closeDBConnection(rs, stmt, null);	
				}
				
			}
			
			response = new ObjectMapper().writeValueAsString(msgList);
		}
		catch (Exception e) {
			e.printStackTrace();
		}finally {
			ConnectionManager.closeDBConnection(null, null, conn);	
		}
		
		return response;
	}
	
}
