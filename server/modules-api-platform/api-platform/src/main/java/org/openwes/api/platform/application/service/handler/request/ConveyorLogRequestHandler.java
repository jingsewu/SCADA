package org.openwes.api.platform.application.service.handler.request;


import lombok.RequiredArgsConstructor;
import org.openwes.api.platform.api.constants.ApiTypeEnum;
import org.openwes.api.platform.application.context.RequestHandleContext;
import org.openwes.api.platform.application.service.handler.RequestHandler;
import org.openwes.common.utils.http.Response;
import org.openwes.common.utils.utils.JsonUtils;
import org.openwes.scada.api.IConveyorLogApi;
import org.openwes.scada.api.dto.ConveyorLogDTO;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ConveyorLogRequestHandler extends RequestHandler {

    private final IConveyorLogApi conveyorLogApi;

    @Override
    public String getApiType() {
        return ApiTypeEnum.CONVEYOR_LOG_REPORT.name();
    }

    @Override
    public void invoke(RequestHandleContext context) {
        ConveyorLogDTO conveyorLogDTO = JsonUtils.string2Object(context.getBody(), ConveyorLogDTO.class);
        conveyorLogApi.create(conveyorLogDTO);
        context.setResponse(Response.builder().build());
    }
}
