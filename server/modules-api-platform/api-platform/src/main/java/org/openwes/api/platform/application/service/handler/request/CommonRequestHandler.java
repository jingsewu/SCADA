package org.openwes.api.platform.application.service.handler.request;

import org.openwes.api.platform.application.context.RequestHandleContext;
import org.openwes.api.platform.application.service.handler.RequestHandler;
import org.springframework.stereotype.Service;

@Service
public class CommonRequestHandler extends RequestHandler {

    @Override
    public String getApiType() {
        return "";
    }

    @Override
    public void invoke(RequestHandleContext context) {

    }

}
