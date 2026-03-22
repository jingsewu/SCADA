// src/App.tsx - 必须在所有其他导入之前，包括 mobx
import { configure } from 'mobx';

// 解决多个 MobX 版本冲突的问题
configure({ isolateGlobalState: true });

// ⚠️⚠️⚠️ 在所有 React 相关导入之前，必须先设置 findDOMNode polyfill
// 这是因为 react-transition-group 等库会在模块加载时就调用 findDOMNode
if (typeof window !== 'undefined') {
    // 创建全局的 ReactDOM 对象（如果不存在）
    (window as any).ReactDOM = (window as any).ReactDOM || {};

    // 立即设置 polyfill，在其他代码执行之前
    if (!(window as any).ReactDOM.findDOMNode) {
        (window as any).ReactDOM.findDOMNode = function(component: any) {
            if (!component) {
                return null;
            }

            // 如果是 DOM 元素，直接返回
            if (component instanceof Element) {
                return component;
            }

            // 处理 React 组件实例
            try {
                // React 18+ 内部属性
                const fiber = (component as any)._reactInternals || (component as any)._owner;
                if (fiber && fiber.stateNode) {
                    return fiber.stateNode;
                }

                // 如果有 current 属性（ref）
                if ('current' in component) {
                    return component.current;
                }

                // 尝试使用 refs
                if ((component as any).refs && Object.keys((component as any).refs).length > 0) {
                    const firstRef = Object.keys((component as any).refs)[0];
                    const refNode = (component as any).refs[firstRef];
                    if (refNode) {
                        return (window as any).ReactDOM.findDOMNode(refNode);
                    }
                }
            } catch (e) {
                console.warn('findDOMNode polyfill error:', e);
            }

            return null;
        };
    }
}

// 然后才是其他导入
import * as React from "react"
import { Provider } from "mobx-react"

import RootRoute from "./routes"
import "./utils/polyfill"
import store from "./stores"
import { AliveScope } from "react-activation"

// css
import "@fortawesome/fontawesome-free/css/all.min.css"
import "bootstrap/dist/css/bootstrap.css"
import "amis/lib/themes/cxd.css"
import "amis/lib/helper.css"
import "amis/sdk/iconfont.css"
import 'antd/dist/reset.css';

// 确保 react-dom 模块也使用这个 polyfill
import * as ReactDOMModule from 'react-dom';
(ReactDOMModule as any).findDOMNode = (window as any).ReactDOM.findDOMNode;

export default function (): React.JSX.Element {
    return (
        <Provider store={store}>
            <AliveScope>
                <RootRoute store={store} />
            </AliveScope>
        </Provider>
    )
}
