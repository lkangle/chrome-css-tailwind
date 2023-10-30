import { useEffect, useState } from "react"
import type { IpcMessage } from "~typing"

function useMessage<T extends any>(
    fn: (data: T, msg: IpcMessage<T>) => void,
    ...filterTypes: string[]
) {
    // 最新的消息
    let [latest, setLatest] = useState<IpcMessage<T>>()

    useEffect(() => {
        window.addEventListener('message', ev => {
            let msg = ev.data as IpcMessage<T>
            let type = msg?.type
            if (!type || (filterTypes && !filterTypes.includes(type))) {
                return
            }

            fn(msg.payload, msg)
            setLatest(msg)
        })
    }, [])

    return latest;
}

export default useMessage