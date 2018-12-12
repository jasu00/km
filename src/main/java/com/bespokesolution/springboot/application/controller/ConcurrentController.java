package com.bespokesolution.springboot.application.controller;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import org.bson.Document;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bespokesolution.dbmanager.ConnectionManager;
import com.bespokesolution.dbmanager.MongoManager;
import com.bespokesolution.model.ConcurrentJob;
import com.bespokesolution.model.ConcurrentRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoIterable;

@RestController
@CrossOrigin
public class ConcurrentController {

	@RequestMapping("/concurrentjobs")
	public String concurrentjobs(){
		
		String response ="Response Not Generated";
		ArrayList<ConcurrentJob> concurrentList = new ArrayList<ConcurrentJob>();
		
		try {
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MMM-yy hh:mm");
			BasicDBObject whereQuery = new BasicDBObject();
			whereQuery.put("code", "Concurrent Job");
			whereQuery.put("active", "Y");
			MongoIterable<Document> results =MongoManager.getCollection("validation").find(whereQuery);
			Connection conn =null;
			
			for (Document doc : results)
			{
				try {
					conn  = ConnectionManager.getConnection(doc.getString("db"));
					PreparedStatement stmt = null;
					ResultSet rs = null;
					ConcurrentJob concurrentJob = null;
					ArrayList<ConcurrentRequest> requestList=null;
					ConcurrentRequest r1 = null;
					ConcurrentRequest r2 = null;
					ConcurrentRequest r3 = null;
					
					String sqlCheck= doc.getString("sql");
					try {
						stmt = conn.prepareStatement(sqlCheck);
						rs = stmt.executeQuery();
						
						while(rs.next())
						{
							concurrentJob = new ConcurrentJob();
							concurrentJob.setProgramId(rs.getInt("CONCURRENT_PROGRAM_ID"));
							concurrentJob.setProgramName(rs.getString("USER_CONCURRENT_PROGRAM_NAME"));
							concurrentJob.setExeName(rs.getString("EXECUTABLE_NAME"));
							concurrentJob.setExeFile(rs.getString("EXECUTION_FILE_NAME"));
							//concurrentJob.setExeMethod(rs.getString("EXECUTION_METHOD"));
							
							requestList = new ArrayList<ConcurrentRequest>();
							r1 = new ConcurrentRequest();
							r1.setRequestId(rs.getInt("R1_REQUEST_ID"));
							r1.setTimeLapse(rs.getString("R1_TIME_ELAPSE"));
							r1.setPhaseCode(rs.getString("R1_PHASE_CODE"));
							r1.setStatusCode(rs.getString("R1_STATUS_CODE"));
							r1.setStatus(rs.getString("R1_STATUS"));
							if(rs.getTimestamp("R1_ACTUAL_START_DATE")!=null)
								r1.setStartDate(simpleDateFormat.format(rs.getTimestamp("R1_ACTUAL_START_DATE")));
							if(rs.getTimestamp("R1_ACTUAL_COMPLETION_DATE")!=null)
								r1.setEndDate(simpleDateFormat.format(rs.getTimestamp("R1_ACTUAL_COMPLETION_DATE")));
							r1.setInterval(rs.getString("R1_RESUBMIT_INTERVAL")+" "+rs.getString("R1_RESUBMIT_INTERVAL_UNIT_CODE"));
							
							r2 = new ConcurrentRequest();
							r2.setRequestId(rs.getInt("R2_REQUEST_ID"));
							r2.setTimeLapse(rs.getString("R2_TIME_ELAPSE"));
							r2.setPhaseCode(rs.getString("R2_PHASE_CODE"));
							r2.setStatusCode(rs.getString("R2_STATUS_CODE"));
							r2.setStatus(rs.getString("R2_STATUS"));
							if (rs.getTimestamp("R2_ACTUAL_START_DATE")!=null)
								r2.setStartDate(simpleDateFormat.format(rs.getTimestamp("R2_ACTUAL_START_DATE")));
							if(rs.getTimestamp("R2_ACTUAL_COMPLETION_DATE")!=null)
								r2.setEndDate(simpleDateFormat.format(rs.getTimestamp("R2_ACTUAL_COMPLETION_DATE")));
							r2.setInterval(rs.getString("R2_RESUBMIT_INTERVAL")+" "+rs.getString("R2_RESUBMIT_INTERVAL_UNIT_CODE"));
							
							r3 = new ConcurrentRequest();
							r3.setRequestId(rs.getInt("R3_REQUEST_ID"));
							r3.setTimeLapse(rs.getString("R3_TIME_ELAPSE"));
							r3.setPhaseCode(rs.getString("R3_PHASE_CODE"));
							r3.setStatusCode(rs.getString("R3_STATUS_CODE"));
							r3.setStatus(rs.getString("R3_STATUS"));
							if(rs.getTimestamp("R3_ACTUAL_START_DATE")!=null)
								r3.setStartDate(simpleDateFormat.format(rs.getTimestamp("R3_ACTUAL_START_DATE")));
							if(rs.getTimestamp("R3_ACTUAL_COMPLETION_DATE")!=null)
								r3.setEndDate(simpleDateFormat.format(rs.getTimestamp("R3_ACTUAL_COMPLETION_DATE")));
							r3.setInterval(rs.getString("R3_RESUBMIT_INTERVAL")+" "+rs.getString("R3_RESUBMIT_INTERVAL_UNIT_CODE"));
							
							requestList.add(r1);
							requestList.add(r2);
							requestList.add(r3);
							
							concurrentJob.setRequestList(requestList);
							
							concurrentList.add(concurrentJob);
						}
					}
					catch (Exception e) {
						e.printStackTrace();
					}finally {
						ConnectionManager.closeDBConnection(rs, stmt, null);	
					}
				}
				catch (Exception e) {
					e.printStackTrace();
				}
				finally {
					ConnectionManager.closeDBConnection(null, null, conn);
				}
			}
			response = new ObjectMapper().writeValueAsString(concurrentList);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			//ConnectionManager.closeDBConnection(null, null, conn);
		}
		
		return response;
	}
}
