//。！？：
import {PUNCTUATION, SentenceNode} from "nlcst-parser-chinese";
import {getNear, rule, visit} from "./utils";
import {isPunctuation} from "nlcst-types";

export const ZH418 = rule(":ZH418", (tree, file) => {
  visit(tree, "SentenceNode", (_sen: any) => {
    const sentence: SentenceNode = _sen
    if (!sentence.isFull) {
      return;
    }
    let i = -1;
    for (const node of sentence.children) {
      i += 1
      if (isPunctuation(node) && !node.isCN) {
        if (node.ptype === PUNCTUATION.UNKNOWN) {
          continue
        }
        if (node.ptype === PUNCTUATION.ELLIPSIS) {
          file.message(`shouldn't use en ellipsis:'${node.value}' in cn sentence`, node?.position?.start, "ZH412");
        } else {

          // 当前后是英文的时候 允许英文符号
          let {last, next} = getNear(i, sentence.children)
          if (!last?.isFull && !next?.isFull){
            continue
          }

          file.message(`shouldn't use half-width char:'${node.value}' in cn sentence`, node?.position?.start);
        }
      }
    }

  });
});
