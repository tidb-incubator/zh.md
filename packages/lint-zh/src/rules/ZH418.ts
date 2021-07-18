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
      // 检测中文句子中的标点符号
      if (isPunctuation(node) && !node.isCN) {
        if (node.ptype === PUNCTUATION.UNKNOWN) {
          continue
        }

        // 禁止所有英文缩略号
        if (node.ptype === PUNCTUATION.ELLIPSIS) {
          file.message(`shouldn't use en ellipsis:'${node.value}' in cn sentence`, node?.position?.start, "ZH412");
          return;
        }

        // 当前后是英文的时候 允许英文符号
        // 或者例如: 这是一个句子，'a'，'b'，和 'c' 都应该是正常的。
        let {last, next} = getNear(i, sentence.children)
        if ((!last?.isFull || isPunctuation(last)) && (!next?.isFull || isPunctuation(next))) {
          continue
        }

        // ignore hyphen
        if (node.ptype === PUNCTUATION.HYPHEN) {
          return;
        }

        file.message(`shouldn't use half-width char:'${node.value}' in cn sentence`, node?.position?.start);
      }
    }

  });
});

