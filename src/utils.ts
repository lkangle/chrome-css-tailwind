import type { TailwindConvertResult } from '~typing'
import EventEmitter from 'eventemitter3'

const ee = new EventEmitter()

export function onMessage(name: string, fn: (...a: any[]) => void): VoidFunction {
    ee.on(name, fn)
    return () => {
        ee.off(name, fn)
    }
}

export function emitMessage<T>(name: string, msg: T) {
    ee.emit(name, msg)
}

export const randomstr = (len = 8) => {
    return Math.random().toFixed(16).slice(2, 2 + len)
}

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

export async function convertToTailwindCSS(css: string): Promise<TailwindConvertResult> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: 'to_tailwindcss',
            payload: css
        }, resp => {
            if (resp.type === "tailwindcss") {
                resolve(resp)
            }
        })

        setTimeout(() => {
            reject(new Error("timeout 3s."))
        }, 3e3);
    })
}
