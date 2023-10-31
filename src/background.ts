import { TailwindConverter } from 'css-to-tailwindcss'

let converter = new TailwindConverter({
    tailwindConfig: {
        content: [],
        theme: {
            spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
                map[index] = `${index}px`;
                return map;
            }, {}) as any,
        },
    }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponent) => {
    console.log('[message]', message);
    if (!message?.payload) return;

    if (message?.type === "to_tailwindcss") {
        converter.convertCSS(message.payload).then(({ nodes, convertedRoot }) => {
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