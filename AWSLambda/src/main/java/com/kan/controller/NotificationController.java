package com.kan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.regions.Regions;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kan.model.Notification;
import com.kan.service.LambdaInvokerService;

@CrossOrigin
@RestController
public class NotificationController {
	
	@Autowired
	LambdaInvokerService lambdaInvokerService;
	
	private final String FUNCTION_NAME = "ws-api-demo-dev-notify";

    @PostMapping("/notify")
    public void notify(@RequestBody Notification notification) throws JsonProcessingException{
    	System.out.println(notification);
    	ObjectMapper objectMapper = new ObjectMapper();
    	String payload = objectMapper.writeValueAsString(notification);
        lambdaInvokerService.invokeFunction(Regions.AP_SOUTHEAST_2, FUNCTION_NAME, payload);
    }
}
