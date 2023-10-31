import { useCallback, useMemo, useRef } from 'react'
import { version } from '../package.json'
import { Input, Spin } from 'antd'
import { debounce } from 'lodash-es'
import useTailConfig from '~hooks/useTailConfig'
import "./style.css"

function IndexPopup() {
  const iframeRef = useRef<HTMLIFrameElement>()

  const { text, loading, updateConfig } = useTailConfig(iframeRef)

  const onChange = useCallback(debounce((e) => {
    let text = e?.target?.value;
    if (!text) {
      return
    }

    updateConfig(text)
  }, 200, { leading: false, trailing: true }), [])

  return (
    <div className="w-[400px] h-200 flex items-center justify-center flex-column flex-col">
      <h3 className='py-5'>配置项</h3>
      <div className="px-10 w-[100%] box-border flex-1">
        {loading && <Spin spinning={true} />}
        {!loading && (
          <Input.TextArea style={{
            resize: 'none',
            height: '100%'
          }} autoSize={false} defaultValue={text} onChange={onChange} placeholder="tailwindcss配置" />
        )}
      </div>
      <div className='py-3'>v{version}</div>
      <iframe src="sandbox.html" ref={iframeRef} className='hidden' />
    </div>
  )
}

export default IndexPopup
