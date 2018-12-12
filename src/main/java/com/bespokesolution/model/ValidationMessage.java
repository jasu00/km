package com.bespokesolution.model;

public class ValidationMessage {
	String code;
	String message;
    String PBI;
    int count;
    int threshold;
    String sqlCheck;
    String xTeam;
    
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getPBI() {
		return PBI;
	}
	public void setPBI(String pBI) {
		PBI = pBI;
	}
	public String getSqlCheck() {
		return sqlCheck;
	}
	public void setSqlCheck(String sqlCheck) {
		this.sqlCheck = sqlCheck;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	public int getThreshold() {
		return threshold;
	}
	public void setThreshold(int threshold) {
		this.threshold = threshold;
	}
	public String getxTeam() {
		return xTeam;
	}
	public void setxTeam(String xTeam) {
		this.xTeam = xTeam;
	}
}
