package com.kan.service;


import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;

import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.AWSLambda;
import com.amazonaws.services.lambda.AWSLambdaClientBuilder;
import com.amazonaws.services.lambda.model.InvokeRequest;
import com.amazonaws.services.lambda.model.InvokeResult;
import com.amazonaws.services.lambda.model.ServiceException;

@Service
public class LambdaInvokerServiceImpl implements LambdaInvokerService{
    @Override
    public void invokeFunction(Regions region, String functionName, String payload) {
    	
    	 InvokeRequest invokeRequest = new InvokeRequest();
    	 invokeRequest
    	 	.withFunctionName(functionName)
    	 	.withPayload(payload);
         
         InvokeResult invokeResult = null;
         
         try {
             AWSLambda awsLambda = AWSLambdaClientBuilder.standard()
                     .withCredentials(new ProfileCredentialsProvider())
                     .withRegion(region).build();

             invokeResult = awsLambda.invoke(invokeRequest);

             String ans = new String(invokeResult.getPayload().array(), StandardCharsets.UTF_8);

             //write out the return value
             System.out.println(ans);

         } catch (ServiceException e) {
             System.out.println(e);
         }
    }
   
}
