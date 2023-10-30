import type { PlasmoCSConfig, PlasmoRender } from "plasmo";
import React from 'react'
import { createRoot } from 'react-dom/client'
import TailwindCss from "~components/TailwindCss";
import styleText from "data-text:~/style.css"
import { onMessage } from "~utils";
import type { CssConvertMessage } from "~typing";
import { updateConvertResult } from "~hooks/useTwCssResult";
import { omit } from "lodash-es";

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    run_at: "document_end"
};

const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = styleText
    return style
}

export const render: PlasmoRender<any> = async () => {
    const div = document.createElement("tailwindcss-div");
    const shadow = div.attachShadow({ mode: "open" })

    const style = getStyle()
    const app = document.createElement("div")
    app.id = "app"
    shadow.append(style, app)

    // react 渲染
    {
        const root = createRoot(app)
        root.render(
            <TailwindCss />
        )
    }

    onMessage('convert_css_success', (msg: CssConvertMessage) => {
        if (msg.anchor) {
            msg.anchor.insertAdjacentElement("beforebegin", div)
            updateConvertResult(omit(msg, 'anchor'))
        }
    })
}