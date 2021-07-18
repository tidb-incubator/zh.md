import {errorMsg, getNear, lintRule, visit} from "./utils";
import {isPunctuation, isWhiteSpace, isWord} from "nlcst-types";
import * as ZHError from "./error";
import {WhiteSpace} from "nlcst-parser-chinese";

export const ZH425 = lintRule("ZH425", (tree, file) => {
  visit(tree, "SentenceNode", (_sen: any, i, parent) => {
    if (i !== 0 && i !== parent.children.length - 1) {
      if (isWhiteSpace(_sen.children[0])) {
        errorMsg(file, ZHError.ZH428, _sen.position.start, "ZH428")
      }
    }

    visit(_sen, WhiteSpace, (node: any, i, parent) => {
      if (node.value.indexOf("  ") > -1) {
        errorMsg(file, ZHError.ZH425, node.position.start, "ZH425")
      }
      let {last, next} = getNear(i, parent.children)
      if (isWord(last) && last.isFull && isWord(next) && next.isFull) {
        errorMsg(file, ZHError.ZH426, node.position.end, "ZH426")
      }

      if (isPunctuation(last) && last.isFull) {
        errorMsg(file, ZHError.ZH427, node.position.start, "ZH427")
      }
    })

  });
});
