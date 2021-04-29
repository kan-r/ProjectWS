package com.kan.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.kan.model.Notification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@CrossOrigin
@RestController
public class NotificationController {


	private final boolean isBgl = false;

	private final String REST_API_URL = "https://6qsj0b74q4.execute-api.ap-southeast-2.amazonaws.com/dev/notifications/";
	private final String REST_API_URL_BGL = "https://6qsj0b74q4.execute-api.ap-southeast-2.amazonaws.com/dev/";


	@PostMapping("/notify")
	public void notify(@RequestBody Notification notification) throws JsonProcessingException {
		System.out.println(notification);

		String url = isBgl ? REST_API_URL_BGL : REST_API_URL;

		url += notification.getClientId();

		System.out.println(url);

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> resp = restTemplate.postForEntity(url, notification, String.class);

		System.out.println(resp);
	}
}
