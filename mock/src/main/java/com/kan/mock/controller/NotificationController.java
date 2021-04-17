package com.kan.mock.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kan.mock.model.Notification;
import com.kan.mock.service.ApiGatewayManagementClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class NotificationController {

    @Autowired
    ApiGatewayManagementClientService apiGatewayManagementClientService;

    private final boolean isBgl = false;

    private final String REGION = "ap-southeast-2";
    private final String WS_API_URL = "https://9gd7gaaro0.execute-api.ap-southeast-2.amazonaws.com/dev";
    private final String WS_API_URL_BGL = "https://bm5uudicf0.execute-api.ap-southeast-2.amazonaws.com/dev/@connections";

    private final String REST_API_URL = "https://t2voqxnvu2.execute-api.ap-southeast-2.amazonaws.com/notify";
    private final String FUNCTION_NAME = "ws-api-demo-dev-notify";

    @PostMapping("/notify")
    public void notify(@RequestBody Notification notification) throws JsonProcessingException {
        System.out.println(notification);

        String url = isBgl ? WS_API_URL_BGL : WS_API_URL;

        System.out.println(url);

//        String data = "{\"connectionId\": \"" +  notification.getConnectionId() + "\", \"message\": \"" + notification.getMessage() + "\"}";
//        System.out.println(data);

        byte[] data = new ObjectMapper().writeValueAsBytes(notification);

        apiGatewayManagementClientService.postToConnection(notification.getConnectionId(), data, url, REGION);
    }
}
