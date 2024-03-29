import type { ResolvedTailwindNode } from "css-to-tailwindcss/lib/TailwindNodesManager"

export type IpcMessage<T> = {
    type: string
    payload: T
}

export type TailwindConvertResult = {
    tailwindcss: string,
    nodes: ResolvedTailwindNode[]
    isLanhu?: boolean
}

export type CssConvertMessage = {
    anchor: HTMLElement
    css: string
} & TailwindConvertResult

export type TailwindConfig = {
    text: string
    config: any
}