package com.kan.mock.model;

import java.io.Serializable;

public class Notification implements Serializable {
    String connectionId;
    String message;

    public String getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(String connectionId) {
        this.connectionId = connectionId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "Notification{" +
                "connectionId='" + connectionId + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
