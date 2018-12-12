package com.bespokesolution.util;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;

import com.bespokesolution.model.ApplicationContext;

import freemarker.template.Configuration;

public class Utility {

	public static final Configuration cfg = new Configuration();
	public static final Client client = ClientBuilder.newClient();
	
	
	/**
	 * Convert the ResultSet to a List of Maps, where each Map represents a row with columnNames and columValues
	 * @param rs
	 * @return
	 * @throws SQLException
	 */
	public static List<Map<String, Object>> resultSetToList(ResultSet rs) throws SQLException {
	    ResultSetMetaData md = rs.getMetaData();
	    int columns = md.getColumnCount();
	    List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();
	    while (rs.next()){
	        Map<String, Object> row = new HashMap<String, Object>(columns);
	        for(int i = 1; i <= columns; ++i){
	            row.put(md.getColumnName(i), rs.getString(i));
	        }
	        rows.add(row);
	    }
	    return rows;
	}
}
