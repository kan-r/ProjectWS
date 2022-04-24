package com.kan;

import com.github.shyiko.mysql.binlog.BinaryLogClient;
import com.github.shyiko.mysql.binlog.event.*;
import com.kan.model.JobStage;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class BinLogMonitor {

    private static final Map<Long, String> tableMap = new HashMap<>();

    public static void main(String[] args) throws Exception {
        monitorBinLog("job_stage");
    }

    private static void monitorBinLog(String tableName) throws Exception {
        BinaryLogClient client = new BinaryLogClient("localhost", 3308, "", "");

        client.registerEventListener(event -> {
            EventData data = event.getData();

            if(data instanceof TableMapEventData) {
                TableMapEventData tableData = (TableMapEventData)data;
                tableMap.put(tableData.getTableId(), tableData.getTable());
                System.out.println(tableData.getTable());
            } else if(data instanceof WriteRowsEventData) {
                WriteRowsEventData eventData = (WriteRowsEventData)data;
                if(tableName.equals(tableMap.get(eventData.getTableId()))) {
                    System.out.print("INSERT -> ");
                    System.out.println(tableMap.get(eventData.getTableId()));
                    for(Object[] row: eventData.getRows()) {
                        System.out.println(toJobStage(row));
                    }
                }
            } else if(data instanceof UpdateRowsEventData) {
                UpdateRowsEventData eventData = (UpdateRowsEventData)data;
                if(tableName.equals(tableMap.get(eventData.getTableId()))) {
                    System.out.print("UPDATE -> ");
                    System.out.println(tableMap.get(eventData.getTableId()));
                    for(Map.Entry<Serializable[], Serializable[]> row : eventData.getRows()) {
                        System.out.print("From: \t");
                        System.out.println(toJobStage(row.getKey()));
                        System.out.print("To: \t");
                        System.out.println(toJobStage(row.getValue()));
                    }
                }
            } else if(data instanceof DeleteRowsEventData) {
                DeleteRowsEventData eventData = (DeleteRowsEventData)data;
                if(tableName.equals(tableMap.get(eventData.getTableId()))) {
                    System.out.print("DELETE -> ");
                    System.out.println(tableMap.get(eventData.getTableId()));
                    for(Object[] row: eventData.getRows()) {
                        System.out.println(toJobStage(row));
                    }
                }
            }
        });
        client.connect();
    }

    private static JobStage toJobStage(Object[] row) {
        return JobStage
                .builder()
                .jobStage(String.valueOf(row[0]))
                .jobStageDesc(String.valueOf(row[1]))
                .active(Boolean.valueOf(String.valueOf(row[2])))
                .dateCrt(String.valueOf(row[3]))
                .userCrt(String.valueOf(row[4]))
                .build();
    }
}

