package com.kan.model;

public class Notification {

    String clientId;
    String message;

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "Notification{" + "clientId='" + clientId + '\'' + ", message='" + message + '\'' + '}';
    }
}
