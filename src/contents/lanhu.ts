import type { PlasmoCSConfig } from "plasmo"
import { convertToTailwindCSS, emitMessage } from "../utils"
import { debounce, last, trim } from "lodash-es";

export const config: PlasmoCSConfig = {
  matches: ["https://lanhuapp.com/*"],
  run_at: "document_end"
};

type DrawerElement = HTMLDivElement & {
  disconnect: VoidFunction
}

let ref: {
  current?: DrawerElement
  css?: string
} = {};

function observeDrawer(el: DrawerElement) {
  if (ref.current) {
    ref.current?.disconnect?.();
    ref.css = '';
  }
  ref.current = el;

  let obsFn = debounce(async () => {
    let detailbox = el.querySelector('.annotation_item.code_detail')
    let codebox = detailbox?.querySelector(".code_box")

    let anchor: any
    let css = ''
    // 获取原本的css样式
    {
      if (codebox) {
        anchor = detailbox;
        css = codebox.textContent;
      } else {
        let itembox = last(Array.from(el.querySelectorAll('.annotation_container > .annotation_item')))
        anchor = itembox;

        let list = el.querySelectorAll('.annotation_container > .annotation_item li')
        let sizebox = Array.from(list).find(li => {
          return trim(li.textContent).startsWith("大小")
        })

        let [width, height] = Array.from(sizebox.querySelectorAll('.item_two')).map(it => trim(it.textContent))
        css = `width: ${width}; height: ${height};`;
      }
      css = `.app { ${css} }`;
    }

    if (ref.css !== css) {
      ref.css = css

      let ttcss = await convertToTailwindCSS(css)
      emitMessage("convert_css_success", {
        anchor, css, ...ttcss, isLanhu: true
      })

      console.log('%c[tailwindcss]', 'color:#3799a8;', ttcss)
    }
  }, 100, { leading: false, trailing: true })

  let obs = new MutationObserver(obsFn)
  obs.observe(el, {
    characterData: true,
    subtree: true,
    childList: true
  })
  el.disconnect = () => {
    obs.disconnect()
  }
}

; (async () => {
  let obs = new MutationObserver(() => {
    const drawerList = document.querySelectorAll('#detail_container .mu-drawer')

    let openDrawer = Array.from(drawerList).find(d => d.classList.contains("open"))
    if (openDrawer && ref.current !== openDrawer) {
      observeDrawer(openDrawer as any);
    }
  })

  obs.observe(document.body, {
    subtree: true,
    attributes: true,
    childList: true,
  })
})();
