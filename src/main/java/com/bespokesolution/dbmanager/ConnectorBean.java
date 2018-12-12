package com.bespokesolution.dbmanager;

public class ConnectorBean {
	private String DB;
	private String url;
	private String username;
	private String pwd;
	private String driver;
	
	public ConnectorBean(String DB,String url, String username, String pwd,String driver) {
		this.DB=DB;
		this.url = url;
		this.username = username;
		this.pwd = pwd;
		this.driver = driver;
	}
	
	public String getDB() {
		return DB;
	}

	public void setDB(String dB) {
		DB = dB;
	}
	
	public ConnectorBean() {
		// TODO Auto-generated constructor stub
	}

	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public String getDriver() {
		return driver;
	}

	public void setDriver(String driver) {
		this.driver = driver;
	}

}

