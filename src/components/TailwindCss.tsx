import useTwCssResult from "~hooks/useTwCssResult"
import { Popover } from 'antd'
import { first, join } from "lodash-es"
import { useCallback, useRef, useState } from "react"

const TailwindCss = () => {
    const result = useTwCssResult(stat => stat.result)

    const ref = useRef(0)
    const [open, setOpen] = useState(false)
    const showTip = useCallback((dur = 1500) => {
        window.clearTimeout(ref.current)
        ref.current = window.setTimeout(() => {
            setOpen(false)
        }, dur)

        setOpen(true)
    }, [])

    const onClick = async () => {
        let classes = join(first(result.nodes)?.tailwindClasses, " ")
        await navigator.clipboard.writeText(classes)

        showTip()
    }

    return (
        <div className={"mt-15 " + (result?.isLanhu ? 'px-24' : '')}>
            <div className="flex justify-between items-center h-30 w-[100%]">
                <h4 className="text-[#000]">tailwindcss</h4>
                <Popover content="复制成功" open={open} placement="top">
                    <button className="cursor-pointer" onClick={onClick}>复制</button>
                </Popover>
            </div>
            <div className="overflow-auto">
                <pre>{result?.tailwindcss}</pre>
            </div>
        </div>
    )
}

export default TailwindCss