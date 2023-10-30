import { create } from "zustand";
import type { TailwindConvertResult } from "~typing";

interface IStore {
    result?: TailwindConvertResult
    setResult(r: TailwindConvertResult): void
}

const useTwCssResult = create<IStore>((set) => {
    return {
        setResult(result) {
            set({ result })
        }
    }
})

export default useTwCssResult

export function updateConvertResult(result: TailwindConvertResult) {
    useTwCssResult.getState().setResult(result)
}