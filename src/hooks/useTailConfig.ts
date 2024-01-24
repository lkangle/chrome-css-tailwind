import { useCallback, useEffect, useMemo, useState, type RefObject } from "react";
import { getItem, setItem } from "~storage";
import type { TailwindConfig } from "~typing";
import { randomstr } from "~utils";

const CONFIG_KEY = 'tailwindcss_config'

let conf = {
    content: [],
    theme: {
        spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
            map[index] = index + 'px';
            return map;
        }, {})
    }
}
let defaultText = `module.exports = {
    content: [],
    theme: {
        spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
            map[index] = index + 'px';
            return map;
        }, {})
    }
}`;

function frameApply<T>(frame: HTMLIFrameElement, text: string): Promise<T> {
    let key = randomstr()
    return new Promise((resolve, reject) => {
        frame.contentWindow.postMessage({
            type: "apply_cjs",
            payload: {
                data: text,
                key
            }
        }, "*")

        let fn = (msg) => {
            if (msg?.data?.type === key) {
                let result = msg?.data?.payload
                resolve(result)
                window.removeEventListener("message", fn)
            }
        }
        window.addEventListener("message", fn)

        setTimeout(() => {
            reject(new Error("apply timeout"))
            window.removeEventListener("message", fn)
        }, 300);
    })
}

function useTailConfig(iframeRef: RefObject<HTMLIFrameElement>) {
    let [config, setConfig] = useState<TailwindConfig>()
    let [loading, setLoading] = useState(true)

    const updateConfig = useCallback(async (inputText: string) => {
        let frame = iframeRef.current

        try {
            let res = await frameApply(frame, inputText)
            if (res) {
                let c = {
                    text: inputText,
                    config: res
                }

                setConfig(c)
                await setItem(CONFIG_KEY, c)
            }
        } catch (e) {
            console.warn(e)
        }
    }, [])

    useEffect(() => {
        getItem<TailwindConfig>(CONFIG_KEY).then((obj) => {
            let c: any = obj || { text: defaultText }
            setConfig(c)
            setLoading(false)
        })
    }, [])

    let text = useMemo(() => {
        if (config == null) {
            return ''
        }
        return config.text
    }, [config])

    return {
        loading,
        text,
        config,
        updateConfig
    }
}

export default useTailConfig

export const getTailwindConfig = async () => {
    let obj = await getItem<TailwindConfig>(CONFIG_KEY)
    return obj?.config || conf
}