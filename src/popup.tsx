import { version } from '../package.json'
import "./style.css"

let c = `{
  content: [],
  theme: {
      spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
          map[index] = index + 'px';
          return map;
      }, {}) as any,
  },
}`

function IndexPopup() {
  return (
    <div className="w-[400px] h-200 flex items-center justify-center flex-column flex-col">
      <h3>配置项</h3>
      <div className="px-10">
        <pre className="whitespace-break-spaces">{c}</pre>
      </div>
      <div>{version}</div>
    </div>
  )
}

export default IndexPopup
