import type { ResolvedTailwindNode } from 'css-to-tailwindcss/lib/TailwindNodesManager'

export function querySelecterWait(selecter: string): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
        let t = window.setInterval(() => {
            let dom = document.querySelector(selecter)
            if (dom) {
                window.clearInterval(t)
                resolve(dom as any)
            }
        }, 200)
    })
}

export async function convertToTailwindCSS(css: string): Promise<{
    tailwindcss: string,
    nodes: ResolvedTailwindNode[]
}> {
    let resp = await chrome.runtime.sendMessage({
        type: 'to_tailwindcss',
        payload: css
    })

    if (resp.type === "tailwindcss") {
        return resp
    }
    return { tailwindcss: css, nodes: [] }
}
