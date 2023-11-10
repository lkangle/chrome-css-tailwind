import { debounce } from "lodash-es";
import type { PlasmoCSConfig } from "plasmo";
import { convertToTailwindCSS, emitMessage, querySelecterWait } from "~utils";

export const config: PlasmoCSConfig = {
    matches: ["https://mastergo.netease.com/*"],
    run_at: "document_end"
};

type DrawerElement = HTMLDivElement & {
    disconnect: VoidFunction
    __vue__: any
}

let ref: {
    current?: DrawerElement
    css?: string
} = {};

const tryFindAnchor = (el: HTMLDivElement): Element => {
    let anchor = el.querySelector('.observe-info__layout > .observe-info')

    let code = anchor.querySelector("#code-box")
    if (code) {
        return anchor;
    }

    let list = el.querySelectorAll('.observe-info__layout .observe-info')
    return Array.from(list).find(c => c.querySelector("#code-box"))
}

const getCssCode = (el: HTMLElement): string => {
    let c = el.querySelector('#code-box code.language-css')
    let text = c?.textContent || '';

    return `.app { ${text} }`
}

const callback = debounce(async () => {
    let anchor = tryFindAnchor(ref.current)
    let code = getCssCode(anchor as any)

    if (code && code !== ref.css) {
        ref.css = code;

        let ttcss = await convertToTailwindCSS(code)

        emitMessage("convert_css_success", {
            anchor, css: code, ...ttcss
        })
        console.log('%c[tailwindcss]', 'color:#3799a8;', ttcss)
    }
}, 100, { leading: false, trailing: true })

function observe(box: DrawerElement) {
    if (ref.current) {
        ref.current?.disconnect?.();
        ref.css = '';
    }
    ref.current = box;

    let obs = new MutationObserver(callback)
    obs.observe(box, {
        subtree: true,
        characterData: true,
        childList: true
    })
    box.disconnect = () => {
        obs.disconnect()
    }
}


; (async () => {
    let box: HTMLDivElement

    const obs = new MutationObserver(() => {
        if (!box?.parentElement) {
            let boxList = document.querySelectorAll(".layout_container .right__container--box")
            if (boxList.length > 0) {
                box = boxList.item(0) as any

                observe(box as any)
            }
        }

    })
    obs.observe(document.body, {
        subtree: true,
        childList: true
    })
})();