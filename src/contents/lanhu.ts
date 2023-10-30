import type { PlasmoCSConfig } from "plasmo"
import { convertToTailwindCSS, querySelecterWait } from "../utils"
import { debounce, trim } from "lodash-es";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
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
    let codebox = el.querySelector('.code_detail > .code_box')

    let css = '';
    // 获取原本的css样式
    {
      if (codebox) {
        css = codebox.textContent;
      } else {
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
      console.log(ttcss, '[[[ttcss')
    }
  }, 200, { leading: false, trailing: true })

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
  let detail = await querySelecterWait("#detail_container")
  let obs = new MutationObserver(() => {
    let drawerList = detail.querySelectorAll('.mu-drawer')
    let openDrawer = Array.from(drawerList).find(d => d.classList.contains("open"))
    if (openDrawer && ref.current !== openDrawer) {
      observeDrawer(openDrawer as any);
    }
  })

  obs.observe(detail, {
    subtree: true,
    attributes: true,
    childList: true,
  })
})();
