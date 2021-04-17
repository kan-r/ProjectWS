package com.kan.mock.service;

import com.amazonaws.services.apigatewaymanagementapi.model.PostToConnectionResult;
import java.util.concurrent.Future;

public interface ApiGatewayManagementClientService {
    public PostToConnectionResult postToConnection(String connectionId, byte[] data, String endPoint, String region);

}
