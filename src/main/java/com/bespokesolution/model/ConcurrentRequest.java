package com.bespokesolution.model;

import java.util.Date;

public class ConcurrentRequest {
	private int requestId;
	private String timeLapse;
	private String phaseCode;
	private String statusCode;
	private String status;
	private String startDate;
	private String endDate;
	private String interval;
	private String intervalUnit;
	private int elapsedTime;

	
	public int getRequestId() {
		return requestId;
	}
	public void setRequestId(int requestId) {
		this.requestId = requestId;
	}
	public String getTimeLapse() {
		return timeLapse;
	}
	public void setTimeLapse(String timeLapse) {
		this.timeLapse = timeLapse;
	}
	public String getPhaseCode() {
		return phaseCode;
	}
	public void setPhaseCode(String phaseCode) {
		this.phaseCode = phaseCode;
	}
	public String getStatusCode() {
		return statusCode;
	}
	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getInterval() {
		return interval;
	}
	public void setInterval(String interval) {
		this.interval = interval;
	}
	public String getIntervalUnit() {
		return intervalUnit;
	}
	public void setIntervalUnit(String intervalUnit) {
		this.intervalUnit = intervalUnit;
	}
	public int getElapsedTime() {
		return elapsedTime;
	}
	public void setElapsedTime(int elapsedTime) {
		this.elapsedTime = elapsedTime;
	}
	
}
