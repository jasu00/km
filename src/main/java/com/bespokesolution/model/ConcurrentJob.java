package com.bespokesolution.model;

import java.util.ArrayList;

public class ConcurrentJob {
	private int programId;
	private String programName;
	private String exeName;
	private String exeFile;
	//private String exeMethod;
	private ArrayList<ConcurrentRequest> requestList;
	
	public int getProgramId() {
		return programId;
	}
	public void setProgramId(int programId) {
		this.programId = programId;
	}
	public String getProgramName() {
		return programName;
	}
	public void setProgramName(String programName) {
		this.programName = programName;
	}
	
	public String getExeName() {
		return exeName;
	}
	public void setExeName(String exeName) {
		this.exeName = exeName;
	}
	public String getExeFile() {
		return exeFile;
	}
	public void setExeFile(String exeFile) {
		this.exeFile = exeFile;
	}
//	public String getExeMethod() {
//		return exeMethod;
//	}
//	public void setExeMethod(String exeMethod) {
//		this.exeMethod = exeMethod;
//	}
	public ArrayList<ConcurrentRequest> getRequestList() {
		return requestList;
	}
	public void setRequestList(ArrayList<ConcurrentRequest> requestList) {
		this.requestList = requestList;
	}
}
