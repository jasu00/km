package com.bespokesolution.springboot.application.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ErrController implements ErrorController{

	 private static final String PATH = "/error";
	 
	@RequestMapping(value = PATH)
    public String error() {
        return "Something went wrong. Please validate ERROR !!!";
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }
	
}


