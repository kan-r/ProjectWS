package com.kan.mock.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.apigatewaymanagementapi.AmazonApiGatewayManagementApiAsync;
import com.amazonaws.services.apigatewaymanagementapi.AmazonApiGatewayManagementApiAsyncClientBuilder;
import com.amazonaws.services.apigatewaymanagementapi.model.PostToConnectionRequest;
import com.amazonaws.services.apigatewaymanagementapi.model.PostToConnectionResult;
import java.nio.ByteBuffer;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class ApiGatewayManagementClientServiceImpl implements ApiGatewayManagementClientService {

    @Async
    @Override
    public PostToConnectionResult postToConnection(String connectionId, byte[] data, String endPoint, String region) {

        EndpointConfiguration config = new EndpointConfiguration(endPoint, region);

        BasicAWSCredentials awsCreds = new BasicAWSCredentials("", "");

        AmazonApiGatewayManagementApiAsync client = AmazonApiGatewayManagementApiAsyncClientBuilder
                .standard()
                .withEndpointConfiguration(config)
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .build();

        PostToConnectionRequest postToConnectionRequest
                = new PostToConnectionRequest().withConnectionId(connectionId).withData(ByteBuffer.wrap(data));

        Future<PostToConnectionResult> future = client.postToConnectionAsync(postToConnectionRequest);

//        while(!future.isDone()) {
//            System.out.println("Calculating...");
//            try {
//                Thread.sleep(300);
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
//        }

        System.out.println(future);

        PostToConnectionResult result = null;
        try {
            result = future.get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return result;
    }
}
