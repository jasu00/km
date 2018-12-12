package com.bespokesolution.dbmanager;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;

import org.bson.Document;

import com.mongodb.BasicDBObject;

public class ConnectionManager {

	private static HashMap<String, ConnectorBean> connectionList;
	
	static {
		loadConnectionList();
	}
	
	private static void loadConnectionList()
	{
			try {
				BasicDBObject whereQuery = new BasicDBObject("name", "Connections").append("active", "Y"); // creates an empty object
				Document doc =MongoManager.getCollection("context").find(whereQuery).first();//retrieves document
				
				List<Document> connectorList = (List<Document>) doc.get("value");
				
				if (!connectorList.isEmpty())
				{
					connectionList =  new HashMap<>();
					for (Document connector : connectorList) {
						
						String DB = connector.getString("DB");
						ConnectorBean cb = new ConnectorBean(DB,connector.getString("url"), connector.getString("username"),connector.getString("pwd"),connector.getString("driver"));
						connectionList.put(DB, cb);
					}
				}
			}
			catch (Exception e) {
				e.printStackTrace();
			}
	}
	
	
	/** Uses DriverManager. 
	 * @param dbname TODO
	 * @param dbname TODO*/
	public static Connection getConnection(String dbname) {
		// See your driver documentation for the proper format of this string :

		if(connectionList==null || connectionList.size()==0)
			loadConnectionList();
			
		ConnectorBean cb =connectionList.get(dbname); //get the value for key dbname

		String DB_CONN_STRING = cb.getUrl();
		String DRIVER_CLASS_NAME = cb.getDriver();
		String USER_NAME = cb.getUsername();
		String PASSWORD = cb.getPwd();

		Connection conn = null;
		try {
			Class.forName(DRIVER_CLASS_NAME);
		} catch (Exception ex) {
			log("Check classpath. Cannot load db driver: " + DRIVER_CLASS_NAME);
		}

		try {
			conn = DriverManager.getConnection(DB_CONN_STRING, USER_NAME, PASSWORD);
		} catch (SQLException e) {
			log("Driver loaded, but cannot connect to db: " + DB_CONN_STRING);
		}
		return conn;
	}
	
	public static boolean closeDBConnection(ResultSet rs, Statement stmt, Connection conn) {
		boolean isClosed = false;
		try {
			if (rs != null)
				rs.close();
			if (stmt != null)
				stmt.close();
			if (conn != null)
				conn.close();

			isClosed = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isClosed;
	}
	private static void log(Object aObject) {
		System.out.println(aObject);
	}

	
	public static void main(String[] args) throws Exception {
		System.out.println("1");
	}
}
