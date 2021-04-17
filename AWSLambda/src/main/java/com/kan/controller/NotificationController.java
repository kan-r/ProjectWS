package com.kan.controller;

import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.apigatewaymanagementapi.AmazonApiGatewayManagementApiAsyncClient;
import com.amazonaws.services.apigatewaymanagementapi.AmazonApiGatewayManagementApiAsyncClientBuilder;
import com.amazonaws.services.apigatewaymanagementapi.model.PostToConnectionRequest;
import com.amazonaws.services.apigatewaymanagementapi.model.PostToConnectionResult;
import com.kan.service.ApiGatewayManagementClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.regions.Regions;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kan.model.Notification;
import com.kan.service.LambdaInvokerService;
import org.springframework.web.client.RestTemplate;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Future;

@CrossOrigin
@RestController
public class NotificationController {
	
	@Autowired
	LambdaInvokerService lambdaInvokerService;

	@Autowired
	ApiGatewayManagementClientService apiGatewayManagementClientService;

	private final boolean isBgl = false;

	private final String REGION = "ap-southeast-2";
	private final String WS_API_URL = "https://9gd7gaaro0.execute-api.ap-southeast-2.amazonaws.com/dev/@connections";
	private final String WS_API_URL_BGL = "https://bm5uudicf0.execute-api.ap-southeast-2.amazonaws.com/dev/@connections";

	private final String REST_API_URL = "https://t2voqxnvu2.execute-api.ap-southeast-2.amazonaws.com/notify";
	private final String FUNCTION_NAME = "ws-api-demo-dev-notify";

	@PostMapping("/notify")
	public void notify(@RequestBody Notification notification) throws JsonProcessingException {
		System.out.println(notification);

		String url = isBgl ? WS_API_URL_BGL : WS_API_URL;

		System.out.println(url);

		String data = "{\"connectionId\": \"" +  notification.getConnectionId() + "\", \"message\": \"" + notification.getBody() + "\"}";
		data = "Hello from Kan";
		System.out.println(data);

		apiGatewayManagementClientService.postToConnection(notification.getConnectionId(), data, url, REGION);
	}

	@PostMapping("/notify2")
	public void notify2(@RequestBody Notification notification) throws JsonProcessingException {
		System.out.println(notification);
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> resp = restTemplate.postForEntity(REST_API_URL, notification, String.class);
		System.out.println(resp);
	}

	@PostMapping("/notify3")
	public void notify3(@RequestBody Notification notification) throws JsonProcessingException {
		System.out.println(notification);
		ObjectMapper objectMapper = new ObjectMapper();
		String payload = objectMapper.writeValueAsString(notification);
		lambdaInvokerService.invokeFunction(Regions.AP_SOUTHEAST_2, FUNCTION_NAME, payload);
	}
}
