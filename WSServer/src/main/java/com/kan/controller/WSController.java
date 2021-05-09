package com.kan.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kan.dto.RequestDto;

@CrossOrigin
@RestController
@RequestMapping("/ws")
public class WSController {
	
	Logger logger = LogManager.getLogger(WSController.class);
	
	@GetMapping("/test")
	public ResponseEntity<String> test() {
		logger.info("/test");
		return new ResponseEntity<String>("Test", HttpStatus.OK);
	}
	
	@PostMapping("/auth")
	public ResponseEntity<String> auth(@RequestHeader HttpHeaders headers, @RequestBody RequestDto requestDto) {
		logger.info("/auth");
		logger.info("Headers: {}", headers);
		logger.info("RequestDto: {}", requestDto);
		
		if(headers.containsKey(HttpHeaders.AUTHORIZATION)) {
			if(!headers.getFirst(HttpHeaders.AUTHORIZATION).equals("cas360")) {
				return new ResponseEntity<String>("Authorization Key value is not valid", HttpStatus.UNAUTHORIZED);
			}
		} else if (headers.containsKey("cas360")) {
			if(!headers.getFirst("cas360").equals("cas360")) {
				return new ResponseEntity<String>("API Key value is not valid", HttpStatus.UNAUTHORIZED);
			}
		} else {
			return new ResponseEntity<String>("Key is not provided", HttpStatus.UNAUTHORIZED);
		}
		
		
		if(requestDto != null && requestDto.getClientId() != null &&  requestDto.getClientId().toUpperCase().equals("KAN")) {
			return new ResponseEntity<String>("Ok", HttpStatus.OK);
		} 
		
		return new ResponseEntity<String>("Forbidden", HttpStatus.FORBIDDEN);
	}
}
