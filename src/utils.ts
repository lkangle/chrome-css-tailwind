import type { ResolvedTailwindNode } from 'css-to-tailwindcss/lib/TailwindNodesManager'

export function querySelecterWait(selecter: string): Promise<HTMLDivElement> {
    return new Promise((resolve, reject) => {
        let mob = new MutationObserver(() => {
            let el = document.querySelector(selecter)
            if (el) {
                resolve(el as HTMLDivElement)
                mob.disconnect()
            }
        })

        mob.observe(document.body, {
            subtree: true,
            childList: true
        })

        setTimeout(() => {
            reject(new Error('timeout'))
        }, 60e3);
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