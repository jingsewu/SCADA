import * as React from "react"
import { render as renderSchema, replaceText } from "amis"
import { IMainStore } from "@/stores"
import { getEnv } from "mobx-state-tree"
import { inject, observer } from "mobx-react"
import { useNavigate, useLocation } from "react-router-dom"
import * as qs from "qs"
import { Action } from "amis/lib/types"
import * as cn from "../locales/zh-cn.json"
import * as en from "../locales/en-us.json"

interface RendererProps {
    schema?: any
    [propName: string]: any
}

type Locale = "zh-CN" | "en-US"

const lang: Record<Locale, any> = {
    "zh-CN": cn,
    "en-US": en
}


interface AMisRendererInnerProps extends RendererProps {
    store?: IMainStore
    navigate: ReturnType<typeof useNavigate>
    location: ReturnType<typeof useLocation>
}

@observer
class AMisRendererInner extends React.Component<AMisRendererInnerProps, any> {
    env: any = null

    handleAction = (e: any, action: Action) => {
        this.env.alert(`没有识别的动作：${JSON.stringify(action)}`)
    }

    constructor(props: AMisRendererInnerProps) {
        super(props)
        const store = props.store
        const navigate = props.navigate
        const location = props.location

        if (!store) {
            throw new Error("Store is required")
        }

        const fetcher = getEnv(store).fetcher
        const notify = getEnv(store).notify
        const alert = getEnv(store).alert
        const confirm = getEnv(store).confirm
        const copy = getEnv(store).copy
        const apiHost = getEnv(store).apiHost
        const getModalContainer = getEnv(store).getModalContainer

        const normalizeLink = (to: string) => {
            to = to || ""
            if (to && to[0] === "#") {
                to = location.pathname + location.search + to
            } else if (to && to[0] === "?") {
                to = location.pathname + to
            }
            const idx = to.indexOf("?")
            const idx2 = to.indexOf("#")
            let pathname = ~idx
                ? to.substring(0, idx)
                : ~idx2
                    ? to.substring(0, idx2)
                    : to
            let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : ""
            let hash = ~idx2 ? to.substring(idx2) : ""
            if (!pathname) {
                pathname = location.pathname
            } else if (pathname[0] != "/" && !/^https?\:\/\//.test(pathname)) {
                let relativeBase = location.pathname
                const paths = relativeBase.split("/")
                paths.pop()
                let m
                while ((m = /^\.\.?\//.exec(pathname))) {
                    if (m[0] === "../") {
                        paths.pop()
                    }
                    pathname = pathname.substring(m[0].length)
                }
                pathname = paths.concat(pathname).join("/")
            }
            return pathname + search + hash
        }

        this.env = {
            session: "global",
            updateLocation:
                props.updateLocation ||
                ((location: string, replace: boolean) => {
                    if (location === "goBack") {
                        return navigate(-1)
                    }
                    navigate(normalizeLink(location), { replace })
                }),
            isCurrentUrl: (to: string) => {
                const link = normalizeLink(to)
                let pathname = link
                let search = ""
                const idx = link.indexOf("?")
                if (~idx) {
                    pathname = link.substring(0, idx)
                    search = link.substring(idx)
                }
                if (search) {
                    if (pathname !== location.pathname || !location.search) {
                        return false
                    }
                    const query = qs.parse(search.substring(1))
                    const currentQuery = qs.parse(location.search.substring(1))
                    return Object.keys(query).every(
                        (key) => query[key] === currentQuery[key]
                    )
                } else if (pathname === location.pathname) {
                    return true
                }
                return false
            },
            jumpTo:
                props.jumpTo ||
                ((to: string, action?: any) => {
                    if (to === "goBack") {
                        return navigate(-1)
                    }
                    to = normalizeLink(to)
                    if (action && action.actionType === "url") {
                        action.blank === false
                            ? (window.location.href = to)
                            : window.open(to)
                        return
                    }
                    if (/^https?:\/\//.test(to)) {
                        window.location.replace(to)
                    } else {
                        navigate(to)
                    }
                }),
            fetcher,
            notify,
            alert,
            confirm,
            copy,
            apiHost,
            getModalContainer
        }
    }

    render() {
        const { schema, store, onAction, navigate, location, ...rest } = this.props
        return renderSchema(
            schema,
            {
                onAction: onAction,
                theme: store && store.theme,
                locale: store && store.locale,
                ...rest
            },
            { ...this.env, replaceText: lang[store!.locale as Locale] }        )
    }
}

function withRouter(Component: React.ComponentType<AMisRendererInnerProps>) {
    return function WithRouter(props: Omit<AMisRendererInnerProps, 'navigate' | 'location'>) {
        const navigate = useNavigate()
        const location = useLocation()
        return <Component {...props} navigate={navigate} location={location} />
    }
}

export default withRouter(inject("store")(AMisRendererInner))
