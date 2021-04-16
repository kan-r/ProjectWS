package com.kan.service;

import com.amazonaws.services.apigatewaymanagementapi.model.PostToConnectionResult;
import java.util.concurrent.Future;

public interface ApiGatewayManagementClientService {
  public Future<PostToConnectionResult> postToConnection(String connectionId, String data, String endPoint, String region);
}
