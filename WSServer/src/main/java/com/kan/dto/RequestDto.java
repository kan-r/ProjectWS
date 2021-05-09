package com.kan.dto;

public class RequestDto {
	
	String clientId;
	String clientName;
	String ipAddress;
	
	public String getClientId() {
		return clientId;
	}
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}
	public String getClientName() {
		return clientName;
	}
	public void setClientName(String clientName) {
		this.clientName = clientName;
	}
	public String getIpAddress() {
		return ipAddress;
	}
	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}
	@Override
	public String toString() {
		return "RequestDto [clientId=" + clientId + ", clientName=" + clientName + ", ipAddress=" + ipAddress + "]";
	}

}
