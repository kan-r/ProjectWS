package com.kan.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement;
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagementClientBuilder;
import com.amazonaws.services.simplesystemsmanagement.model.GetParameterRequest;
import com.amazonaws.services.simplesystemsmanagement.model.GetParameterResult;
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest;
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathResult;
import com.amazonaws.services.simplesystemsmanagement.model.Parameter;;

@Service
public class ParamStoreService {
	
	private final int MAX_RESULTS = 5;
	
	public Map<String, String> getParams(Regions region, String path) {
		AWSSimpleSystemsManagement ssmManagement = AWSSimpleSystemsManagementClientBuilder
				.standard()
				.withRegion(region)
				.build();
		
		GetParametersByPathRequest request = new GetParametersByPathRequest().withPath(path);
		GetParametersByPathResult result = ssmManagement.getParametersByPath(request);
		List<Parameter> params = result.getParameters();
		
		return params.stream().collect(Collectors.toMap(Parameter::getName, Parameter::getValue));
	}
	
	public Map<String, String> getParams2(Regions region, String path) {
		Map<String, String> paramsMap = new HashMap<String, String>();
		
		AWSSimpleSystemsManagement ssmManagement = AWSSimpleSystemsManagementClientBuilder
				.standard()
				.withRegion(region)
				.build();
		
		GetParametersByPathRequest request = new GetParametersByPathRequest().withPath(path).withMaxResults(MAX_RESULTS);
		GetParametersByPathResult result = ssmManagement.getParametersByPath(request);
		
		List<Parameter> params = result.getParameters();
		paramsMap.putAll(params.stream().collect(Collectors.toMap(Parameter::getName, Parameter::getValue)));
		String nextToken = result.getNextToken();
		
		while(nextToken != null && !nextToken.isBlank()) {
			request = request.withNextToken(nextToken);
			result = ssmManagement.getParametersByPath(request);
			
			params = result.getParameters();
			paramsMap.putAll(params.stream().collect(Collectors.toMap(Parameter::getName, Parameter::getValue)));
			nextToken = result.getNextToken();
		}
		
		return paramsMap;
	}
	
	public Map<String, String> getParam(Regions region, String name) {
		AWSSimpleSystemsManagement ssmManagement = AWSSimpleSystemsManagementClientBuilder
				.standard()
				.withRegion(region)
				.build();
		
		GetParameterRequest request = new GetParameterRequest().withName(name);
		GetParameterResult result = ssmManagement.getParameter(request);
		Parameter param = result.getParameter();
		
		Map<String, String> paramMap = Map.of(param.getName(), param.getValue());
		
		return paramMap;
	}
}
