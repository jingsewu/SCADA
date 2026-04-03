import * as React from "react"
import { ToastComponent, AlertComponent } from "amis"
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom"
import { observer } from "mobx-react"
import { IMainStore } from "@/stores"
import Login from "../pages/Login"
import Index from "../pages"

import "froala-editor/css/froala_style.min.css"
import "froala-editor/css/froala_editor.pkgd.min.css"

export default observer(function ({ store }: { store: IMainStore }) {
    return (
        <BrowserRouter>
            <div className="routes-wrapper">
                <ToastComponent
                    key="toast"
                    position={"top-center"}
                    theme={store.theme}
                />
                <AlertComponent key="alert" theme={store.theme} />
                <Routes>
                    <Route path="/login" element={<Login store={store} />} />
                    <Route path="/*" element={<Index store={store} />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
})
