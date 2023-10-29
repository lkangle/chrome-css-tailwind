import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import { convertToTailwindCSS, querySelecterWait } from "~utils";
import type { DrawerWatchFn, DrawerInfo } from '~typing'
import { debounce, last, trim } from "lodash-es";
import styleText from "data-text:~style.css"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    run_at: "document_end"
};

async function watchDrawer(callback: DrawerWatchFn) {
    let box = await querySelecterWait("#detail_container")
    let info: DrawerInfo = { isOpen: false, dom: null, anchor: null, css: '' }

    const getAnchor = (): HTMLElement => {
        if (!info.dom) {
            return null;
        }
        let codedetail = info.dom.querySelector('.annotation_container .code_detail')
        if (codedetail) {
            return codedetail as any;
        }
        return last(Array.from(info.dom.querySelectorAll('.annotation_container > div')))
    }

    const getCss = () => {
        let codebox = box.querySelector('.code_detail > .code_box')

        let css = '';
        if (codebox) {
            css = codebox.textContent;
        } else {
            let list = box.querySelectorAll('.annotation_container > .annotation_item li')
            let sizebox = Array.from(list).find(li => {
                return trim(li.textContent).startsWith("大小")
            })

            let [width, height] = Array.from(sizebox.querySelectorAll('.item_two')).map(it => trim(it.textContent))
            css = `width: ${width}; height: ${height};`;
        }
        css = `.app { ${css} }`;

        return css;
    }

    let obsfn = debounce(ms => {
        let openel = box.querySelector('.mu-drawer.open')

        const setAnchor = () => {
            let anchor = getAnchor()
            if (info.anchor == null) {
                info.anchor = anchor;
                callback({ type: 'amount', payload: info })
                return;
            }
            if (info.anchor !== anchor) {
                info.anchor = anchor;
                callback({ type: 'unmount', payload: info })
                callback({ type: 'amount', payload: info })
            }
        }

        if (openel && info.isOpen === false) {
            info.dom = openel as any;
            info.isOpen = true;
        }

        if (!openel && info.isOpen) {
            info.dom = null;
            info.isOpen = false;
            callback({ type: 'unmount', payload: info })
        }

        if (info.isOpen) {
            setAnchor()

            let css = getCss()
            if (info.css != css) {
                info.css = css;
                callback({ type: 'change', payload: info })
            }
        }
    }, 200, { leading: false, trailing: true })

    const obs = new MutationObserver(obsfn)
    obs.observe(box, {
        subtree: true,
        childList: true,
        characterData: true
    })
}

watchDrawer((r) => {
    console.log(JSON.stringify(r), '[[[sss')
})