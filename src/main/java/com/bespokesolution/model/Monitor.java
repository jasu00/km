package com.bespokesolution.model;

import java.util.Date;

public class Monitor {

	public enum MonitorType{
		CONCURRENT,LEGACYCONCURRENT
	};

	public enum FrequencyType{
		MIN,HOUR,DAY,WEEK
	};

	int monitorId;
	String monitorName;
	MonitorType monitorType;
	int frequency;
	FrequencyType freqType;
	String freqUnit;
	String status;
	int backlog;
	Date lastBacklog;
	
	public Monitor(int monitorId, MonitorType monitorType) {
		this.monitorId= monitorId;
		this.monitorType= monitorType;		
	}

	public int getMonitorId() {
		return monitorId;
	}

	public void setMonitorId(int monitorId) {
		this.monitorId = monitorId;
	}

	public String getMonitorName() {
		return monitorName;
	}

	public void setMonitorName(String monitorName) {
		this.monitorName = monitorName;
	}

	public MonitorType getMonitorType() {
		return monitorType;
	}

	public void setMonitorType(MonitorType monitorType) {
		this.monitorType = monitorType;
	}

	public int getFrequency() {
		return frequency;
	}

	public void setFrequency(int frequency) {
		this.frequency = frequency;
	}

	public FrequencyType getFreqType() {
		return freqType;
	}

	public void setFreqType(FrequencyType freqType) {
		this.freqType = freqType;
	}

	public String getFreqUnit() {
		return freqUnit;
	}

	public void setFreqUnit(String freqUnit) {
		this.freqUnit = freqUnit;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int getBacklog() {
		return backlog;
	}

	public void setBacklog(int backlog) {
		this.backlog = backlog;
	}

	public Date getLastBacklog() {
		return lastBacklog;
	}

	public void setLastBacklog(Date lastBacklog) {
		this.lastBacklog = lastBacklog;
	}

}
