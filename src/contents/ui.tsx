import type { PlasmoCSConfig, PlasmoRender } from "plasmo";
import { createRoot } from 'react-dom/client'
import styleText from "data-text:~style.css"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    run_at: "document_end"
};

export const getStyle = () => {
    let style = document.createElement("style")
    style.innerHTML = styleText
    return style
}

let csscode = `
.app {
    @apply w-329 h-17 text-[17px] font-normal text-white leading-[43px];
    font-family: PingFang SC;
}
`

const TailwindCss = ({ code }) => {
    return (
        <div>
            <div className="flex justify-between items-center h-30 w-[100%]">
                <div>tailwindcss</div>
                <button>复制</button>
            </div>
            <div>
                <pre>{code}</pre>
            </div>
        </div>
    )
}

const App = () => {
    return (
        <TailwindCss code={csscode} />
    )
}

export const getRootContainer = () => {
    let div = document.createElement("div")
    div.id = "root_tailwindcss"

    document.body.append(div)
    return div
}

export const render: PlasmoRender<any> = async (
    { createRootContainer },
) => {
    const rootContainer = await createRootContainer()

    const app = document.createElement("div")
    app.id = 'app';

    const style = document.createElement("style")
    style.innerHTML = styleText

    rootContainer.append(style, app)
    const root = createRoot(app) // Any root
    root.render(
        <div className="w-300 absolute top-0 z-[99999]">
            <App />
        </div>
    )
}