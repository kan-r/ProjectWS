package com.kan.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement;
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagementClientBuilder;
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest;
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathResult;
import com.amazonaws.services.simplesystemsmanagement.model.Parameter;

@Service
public class ParamStoreService {
	
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
}
