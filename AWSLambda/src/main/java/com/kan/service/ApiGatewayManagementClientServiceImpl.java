package com.kan.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.apigatewaymanagementapi.AmazonApiGatewayManagementApiAsync;
import com.amazonaws.services.apigatewaymanagementapi.AmazonApiGatewayManagementApiAsyncClientBuilder;
import com.amazonaws.services.apigatewaymanagementapi.model.PostToConnectionRequest;
import com.amazonaws.services.apigatewaymanagementapi.model.PostToConnectionResult;
import java.nio.ByteBuffer;
import java.util.concurrent.Future;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class ApiGatewayManagementClientServiceImpl implements ApiGatewayManagementClientService {

  @Async
  @Override
  public Future<PostToConnectionResult> postToConnection(String connectionId, String data, String endPoint, String region) {

    EndpointConfiguration config = new EndpointConfiguration(endPoint, region);

    BasicAWSCredentials awsCreds = new BasicAWSCredentials("AKIAS3OBSJG2JLIB5A7K", "TteKxWzWt2zWDhcU2VF9qlBS4+VTl+4/56W+51cj");

    AmazonApiGatewayManagementApiAsync client = AmazonApiGatewayManagementApiAsyncClientBuilder
        .standard()
        .withEndpointConfiguration(config)
//        .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
        .build();

    PostToConnectionRequest postToConnectionRequest
        = new PostToConnectionRequest().withConnectionId(connectionId).withData(ByteBuffer.wrap(data.getBytes()));

    return client.postToConnectionAsync(postToConnectionRequest);
  }
}
