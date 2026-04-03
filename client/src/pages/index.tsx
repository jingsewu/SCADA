import * as React from "react"
import {Navigate, Routes, Route, useNavigate, useLocation} from "react-router-dom"
import {Layout, toast} from "amis"
import {IMainStore} from "@/stores"
import {inject, observer} from "mobx-react"
import request from "@/utils/requestInterceptor"
import RouterGuard from "@/routes/RouterGuard"
import TabsLayout from "./components/TabsLayout"
import type {MenuProps} from "antd"
import {Affix, Button, Modal} from "antd"
import {languageList} from "@/pages/components/Language"
import LayoutAside from "@/components/LayoutAside"
import LayoutHeader from "@/components/LayoutHeader"
import RobotSvg from "@/icon/fontIcons/robot.svg" // path to your '*.svg' file.
import Chatbot from "@/components/Chatbot"
import style from "./index.module.scss"
import classNames from "classnames/bind"
import {Translation} from "react-i18next";

const cx = classNames.bind(style)

export interface NavChildren {
    path: string
    permissions?: string
    title?: string
    languageValueMappings?: any
}

export interface Navigations {
    children: NavChildren[]
    path: string
    permission: string
    languageValueMappings: any
}

export interface State {
    menus: Object
    selectedApp: string
    applications: MenuProps["items"]
    hasLoadMenu: boolean
    navigations: Navigations[]
    iframeShow: number
    iframeUrl: string
    isModalOpen: boolean
}

export interface AdminProps {
    store: IMainStore
    navigate?: any
    location?: any
}

@inject("store")
@observer
class Admin extends React.Component<AdminProps, State> {
    state: State = {
        menus: Object,
        selectedApp: "",
        applications: [],
        hasLoadMenu: false,
        navigations: [],
        iframeShow: 0,
        iframeUrl: "",
        isModalOpen: false
    }

    onApplicationChange = (value: any) => {
        let menus: any = this.state.menus
        this.setState({
            selectedApp: value.key,
            navigations: [menus[value.key]] || [],
            iframeShow: menus[value.key].iframeShow,
            iframeUrl: menus[value.key].children?.[0]?.path
        })
    }

    onLanguageChange = (e: any) => {
        let menuList: string[] = Object.keys(this.state.menus)
        const options = menuList.map((menu) => {
            return {
                key: menu,
                label: (this.state.menus as any)[menu].title
            }
        })
        if (this.state.iframeShow) {
            const postUrl = this.state.iframeUrl.split("#")[0]
            window?.frames[0]?.postMessage(e.locale, postUrl)
        }

        this.setState({
            ...this.state,
            applications: options || []
        })
    }

    logout = () => {
        const store = this.props.store
        store.user.logout()
        const navigate = this.props.navigate
        navigate(`/login`, { replace: true })
    }

    componentDidMount() {
        const store = this.props.store
        const navigate = this.props.navigate
        if (!store.user.isAuthenticated) {
            toast["error"]("用户未登陆，请先登陆！", "消息")
            navigate(`/login`, { replace: true })
        }
        this.refreshMenu()
        this.getAllDictionaryData()
    }

    componentDidUpdate() {
        this.refreshMenu()
    }

    refreshMenu = () => {
        const store = this.props.store
        let pathname = this.props.location.pathname
        if (
            pathname !== "login" &&
            pathname !== "/" &&
            !this.state.hasLoadMenu &&
            store.user.isAuthenticated
        ) {
            request({
                method: "get",
                headers: {
                    terminalType: "PC"
                },
                url: "/user/api/currentUser/getAuth"
            }).then((res: any) => {
                let menus = res.data.menus
                localStorage.setItem("permissions", res.data.permissions)
                let applications: string[] = Object.keys(menus)
                let selectedApp = applications[0]
                let navigations = [menus[selectedApp]] || []
                const options = applications.map((value) => {
                    return {
                        key: value,
                        label:
                            <Translation>
                                {(t) => t(menus[value].title)}
                            </Translation>
                    }
                })

                this.setState({
                    menus: menus,
                    navigations: navigations,
                    selectedApp: selectedApp,
                    applications: options,
                    hasLoadMenu: true,
                    iframeShow: menus[selectedApp].iframeShow,
                    iframeUrl: menus[selectedApp].children?.[0]?.path
                })

            })
        }
    }

    getAllDictionaryData = () => {
        request({
            method: "post",
            url: `/mdm/config/dictionary/getAll`
        }).then((res: any) => {
            localStorage.setItem("dictionary", JSON.stringify(res?.data))
        })
    }

    iframeMenuClick = (path: string, permissions: string, e: any) => {
        e.stopPropagation()
        this.setState({
            ...this.state,
            iframeUrl: path
        })
        const navigate = this.props.navigate
        navigate(permissions, { replace: true })
    }

    onIframeTabChange = (path: string) => {
        this.setState({
            ...this.state,
            iframeUrl: path
        })
    }

    iFrameLoadTest = async () => {
        const locale = languageList.find(
            (item) => item.value === this.props.store.locale
        )?.locale
        const postUrl = this.state.iframeUrl.split("#")[0]
        await window?.frames[0].postMessage(locale, postUrl)
    }

    handleClick = () => {
        this.setState({
            ...this.state,
            isModalOpen: true
        })
    }

    handleCancel = () => {
        this.setState({
            ...this.state,
            isModalOpen: false
        })
    }

    render() {
        const store = this.props.store
        let pathname = this.props.location.pathname
        if (pathname == "login" || pathname == "/") {
            return (
                <Routes>
                    <Route path="*" element={<RouterGuard/>} />
                </Routes>
            )
        } else {
            return (
                <>
                    <Layout
                        aside={
                            <LayoutAside
                                navigations={this.state.navigations}
                                iframeShow={this.state.iframeShow}
                                iframeMenuClick={this.iframeMenuClick}
                            />
                        }
                        header={
                            <LayoutHeader
                                selectedApp={this.state.selectedApp}
                                applications={this.state.applications}
                                onApplicationChange={this.onApplicationChange}
                                onLanguageChange={this.onLanguageChange}
                            />
                        }
                        folded={store.asideFolded}
                        offScreen={store.offScreen}
                    >
                        <TabsLayout
                            selectedApp={this.state.selectedApp}
                            navigations={this.state.navigations}
                            iframeShow={this.state.iframeShow}
                            onIframeTabChange={this.onIframeTabChange}
                            navigate={this.props.navigate}
                            location={this.props.location}
                            store={store}
                        />
                        {this.state.iframeShow ? (
                            <iframe
                                id="microFrontIframe"
                                src={this.state.iframeUrl}
                                height="100%"
                                onLoad={this.iFrameLoadTest}
                                allowFullScreen={true}
                                scrolling="no"
                            />
                        ) : (
                            <Routes>
                                <Route path="*" element={<RouterGuard/>} />
                            </Routes>
                        )}
                    </Layout>
                    <Affix className={cx("fixButton")}>
                        <Button
                            type="text"
                            shape="circle"
                            icon={<RobotSvg style={{fontSize: 60}}/>}
                            onClick={this.handleClick}
                        ></Button>
                        <span className="tooltip">
                            {<Translation>{(t) => t("ai.chat.span")}</Translation>}
                        </span>
                    </Affix>
                    <Modal
                        title={<Translation>{(t) => t("ai.chat.title")}</Translation>}
                        footer={null}
                        maskClosable={true}
                        open={this.state.isModalOpen}
                        onCancel={this.handleCancel}
                        width={1000}
                        bodyStyle={{
                            padding: "0 0 24px 0",
                            backgroundColor: "#fff"
                        }}
                    >
                        <Chatbot/>
                    </Modal>
                </>
            )
        }
    }
}

const AdminWithRouter = (props: any) => {
    const navigate = useNavigate();
    const location = useLocation();
    return <Admin {...props} navigate={navigate} location={location} />;
};

export default AdminWithRouter
