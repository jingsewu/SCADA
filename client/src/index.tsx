/**
 * @file entry of this example.
 */
import * as React from "react"
import { createRoot } from "react-dom/client"
import { configure } from "mobx"

import App from "./App"
import "./react-i18next-config"

configure({ isolateGlobalState: true })

export function bootstrap(mountTo: HTMLElement) {
    console.log("mountTo", mountTo)
    const root = createRoot(mountTo)
    root.render(<App />)
}

;(self as any).MonacoEnvironment = {}

bootstrap(document.getElementById("root")!)
