import { TailwindConverter } from 'css-to-tailwindcss'
import { getTailwindConfig } from '~hooks/useTailConfig';

async function convertCSS(css: string) {
    const config = await getTailwindConfig()
    const converter = new TailwindConverter({
        tailwindConfig: config || {}
    })

    return converter.convertCSS(css)
}

chrome.runtime.onMessage.addListener((message, sender, sendResponent) => {
    console.log('[message]', message);
    if (!message?.payload) return;

    if (message?.type === "to_tailwindcss") {
        convertCSS(message.payload).then(({ nodes, convertedRoot }) => {
            sendResponent({
                type: 'tailwindcss',
                nodes,
                tailwindcss: convertedRoot.toString()
            })
        })
    }

    return true;
})

console.log("[background init]")