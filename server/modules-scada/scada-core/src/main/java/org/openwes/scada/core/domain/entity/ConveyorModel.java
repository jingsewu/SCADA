package org.openwes.scada.core.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.openwes.scada.core.infrastructure.plc.model.PLCConfig;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Data
public class ConveyorModel {

    private Long id;

    private String areaCode;
    private String conveyorCode;

    private PLCConfig plcConfig; // Protocol-agnostic config

    private List<ConveyorNode> nodes;

    @Data
    public static class ConveyorNode {
        private String nodeCode;
        private int angle;
        private boolean inflectionPoint;
        private String nextNodeCodes;

        private String containerCode;
        private boolean hasBox;

        //for plc read
        private String address;

        @JsonIgnore
        public List<String> getNextNodeCodeList() {
            if (StringUtils.isEmpty(nextNodeCodes)) {
                return Collections.emptyList();
            }
            return Arrays.stream(this.nextNodeCodes.split(",")).toList();
        }

        public void updateNodeState(boolean hasBox) {
            this.hasBox = hasBox;
        }
    }
}
