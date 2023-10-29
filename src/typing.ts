export type IpcMessage<T> = {
    type: string
    payload: T
}

// 抽屉面板信息
export type DrawerInfo = {
    isOpen: boolean
    dom: HTMLElement | null
    css: string
    // 挂载点dom
    anchor: HTMLElement | null
}

// 规定监听页面上面板内容变化的函数
// 事件有 amount, unmount, change
// amount: 表示可以挂载渲染的dom了, 挂载点为anchor元素之前
// unmount: 表示卸载之前渲染的dom
// change: 表示css内容变化
export type DrawerWatchFn = (msg: IpcMessage<DrawerInfo>) => void
