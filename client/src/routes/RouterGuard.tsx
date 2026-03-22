import * as React from "react"
import { useLocation, Navigate } from "react-router-dom"
import path2components from "@/routes/path2Compoment"
import KeepAlive from "react-activation"
import { NotFound, Spinner } from "amis"
import { handleRouteData } from "@/pages/components/TabsLayout"

interface RouterGuardProps {
    location?: ReturnType<typeof useLocation>
}

export default function RouterGuard() {
    const location = useLocation();
    const pathname = location.pathname;

    // 查找匹配的组件
    const path2ComponentItem = path2components.find((v) => {
        let path = v.path;
        if (path != null && !path.startsWith("/")) {
            path = "/" + path;
        }
        return path === pathname;
    });

    const Component = path2ComponentItem?.component || NotFound;

    // 检查是否需要缓存
    const { allowedData } = handleRouteData(path2components);
    const allowed = allowedData.find(
        (item) => item.path === pathname && item.cache
    );
    const shouldCache = !!allowed;

    return (
        <React.Suspense fallback={<div>loading</div>}>
            <KeepAlive
                id={pathname}
                name={pathname}
                when={shouldCache}
            >
                <Component />
            </KeepAlive>
        </React.Suspense>
    );
}
