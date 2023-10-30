import useTwCssResult from "~hooks/useTwCssResult"

const TailwindCss = () => {
    const result = useTwCssResult(stat => stat.result)

    console.log('%c[tailwind]', 'color:blue;', result)

    return (
        <div className="px-24 mt-15">
            <div className="flex justify-between items-center h-30 w-[100%]">
                <h4 className="text-[#000]">tailwindcss</h4>
                <button className="cursor-pointer">复制</button>
            </div>
            <div className="overflow-auto">
                <pre>{result?.tailwindcss}</pre>
            </div>
        </div>
    )
}

export default TailwindCss