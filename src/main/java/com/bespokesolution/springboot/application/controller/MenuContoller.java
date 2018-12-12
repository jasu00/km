package com.bespokesolution.springboot.application.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bespokesolution.service.MenuService;

@RestController
@CrossOrigin
public class MenuContoller {
	
	@RequestMapping("/menulist")
	public String menuList(){
		
		return MenuService.getMenuList();
	}
}


