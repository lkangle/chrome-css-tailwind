export async function getItems<K extends string>(...keys: K[]): Promise<Record<K, any>> {
    let obj = await chrome.storage.local.get(keys)
    return obj as any
}

export async function getItem<T>(key: string): Promise<T> {
    const obj = await chrome.storage.local.get(key)
    return obj?.[key]
}

export function setItem(key: string, value: any) {
    return chrome.storage.local.set({
        [key]: value
    })
}

export function setItems(obj: Record<string, any>) {
    return chrome.storage.local.set(obj)
}