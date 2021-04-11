package com.kan.model;

public class Notification {
    String connectionId;
    String body;

    public String getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(String connectionId) {
        this.connectionId = connectionId;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    @Override
    public String toString() {
        return "Notification{" +
                "connectionId='" + connectionId + '\'' +
                ", body='" + body + '\'' +
                '}';
    }
}
