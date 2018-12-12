package com.bespokesolution.model;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class CRBean {
	private String title;
	private Date start;
	private Date end;
	private String desc;
	private String apps;
	private String impact;
	private String duration;
	private String assessedOn;
	private String biz_impact;
	private final String className = "cr";
	private final String active = "Y";
	SimpleDateFormat formatter6=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
	
	public CRBean(ArrayList<String> a) {
		// TODO Auto-generated constructor stub
		this.title=a.get(0);
		this.start = setStartDate(a.get(1)); //need to set
		this.end = setEndDate(a.get(2)); //need to set
		this.desc = a.get(4);
		this.apps = a.get(6);
		this.impact = a.get(3);
		this.duration = a.get(8);
		this.assessedOn = a.get(11);
		this.biz_impact = a.get(7);
	}


	public String getBiz_impact() {
		return biz_impact;
	}


	public void setBiz_impact(String biz_impact) {
		this.biz_impact = biz_impact;
	}


	public String getAssessedOn() {
		return assessedOn;
	}


	public void setAssessedOn(String assessedOn) {
		this.assessedOn = assessedOn;
	}


	public CRBean() {
		// TODO Auto-generated constructor stub
	}


	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Date getStart() {
		return start;
	}
	public void setStart(Date start) {
		this.start = start;
	}
	public Date getEnd() {
		return end;
	}
	public void setEnd(Date end) {
		this.end = end;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getApps() {
		return apps;
	}
	public void setApps(String apps) {
		this.apps = apps;
	}
	public String getImpact() {
		return impact;
	}
	public void setImpact(String impact) {
		this.impact = impact;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public String getClassName() {
		return className;
	}
	public String getActive() {
		return active;
	}
	
public Date setStartDate(String sdate)
{	
	Date start = null;
	try {
		start = formatter6.parse(sdate);
	} catch (ParseException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	
	return start;	
}

public Date setEndDate(String edate)
{
    Date end = null;
	try {
		end = formatter6.parse(edate);
	} catch (ParseException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	
	return end;
}

}
