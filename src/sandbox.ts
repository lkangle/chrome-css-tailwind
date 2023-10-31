import type { IpcMessage } from "~typing"

function applycjs<R>(js: string): R {
    const data = {
        exports: null
    }
    const fn = new Function('module', 'exports', js)
    fn.apply(window, [data, data.exports])

    return data.exports
}

self.addEventListener("message", async function (event) {
    const data = event.data as IpcMessage<any>
    const source = event.source as {
        window: WindowProxy
    }

    if (data?.type === "apply_cjs") {
        let key = data.payload?.key;
        let jsobj = applycjs(data.payload?.data)
        source.window.postMessage({
            type: key,
            payload: jsobj
        }, event.origin)
    } else {
        source.window.postMessage({ type: 'unknown' }, event.origin)
    }
})