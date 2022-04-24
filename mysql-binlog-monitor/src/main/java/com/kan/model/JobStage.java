package com.kan.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobStage {
    private String jobStage;
    private String jobStageDesc;
    private boolean active;
    private String dateCrt;
    private String userCrt;
    private String dateMod;
    private String userMod;
}
