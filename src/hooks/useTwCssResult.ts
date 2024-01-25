import { first, map } from "lodash-es";
import { create } from "zustand";
import type { TailwindConvertResult } from "~typing";

enum NodeType {
    TAILWIND = 0,
    CSS = 1
}

type INode = {
    type: NodeType
    text: string
}

type IResult = TailwindConvertResult & {
    nodeList: INode[]
}

interface IStore {
    result?: IResult
    setResult(r: TailwindConvertResult): void
}

const useTwCssResult = create<IStore>((set) => {
    return {
        setResult(result) {
            const node = first(result.nodes)
            const nodeList: INode[] = map(node?.rule?.nodes, (ru: any) => {
                if (ru.name === 'apply') {
                    return {
                        type: NodeType.TAILWIND,
                        text: ru.params
                    }
                }

                let prop = ru.prop;
                if (prop) {
                    return {
                        type: NodeType.CSS,
                        text: `${prop}: ${ru.value};`
                    }
                }
            }).filter(Boolean)

            set({
                result: {
                    ...result, nodeList
                }
            })
        }
    }
})

export default useTwCssResult

export function updateConvertResult(result: TailwindConvertResult) {
    useTwCssResult.getState().setResult(result)
}