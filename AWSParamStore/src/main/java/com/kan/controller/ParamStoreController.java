package com.kan.controller;

import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.regions.Regions;
import com.kan.service.ParamStoreService;


@CrossOrigin
@RestController
@RequestMapping("/ps")
public class ParamStoreController {

	Logger logger = LogManager.getLogger(ParamStoreController.class);
	
	@Autowired
	ParamStoreService paramStoreService;
	
	@GetMapping("/test")
	public String test() {
		logger.info("/test");
		return "Test";
	}
	
	@GetMapping("/params")
	public Map<String, String> getParams(@RequestParam String path) {
		logger.info("/params?path={}", path);
		
		try {
			return paramStoreService.getParams(Regions.AP_SOUTHEAST_2, path);
		} catch (Exception e) {
			logger.error(e.getMessage());
			return null;
		}
	}

}
