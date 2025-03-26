package org.openwes.api.platform.api.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.openwes.common.utils.dictionary.IEnum;

@Getter
@AllArgsConstructor
public enum ApiTypeEnum implements IEnum {

    /**
     * WMS API
     */


    /**
     * WCS API
     */
    CONVEYOR_LOG_REPORT("CONVEYOR_LOG_REPORT", "输送线日志上报");


    private final String value;
    private final String label;

    private final String name = "API类型";

}
