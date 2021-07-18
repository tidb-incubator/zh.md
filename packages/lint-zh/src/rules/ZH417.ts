import {rule, visit, visitChildren} from "./utils";
import {PUNCTUATION, Punctuation} from "nlcst-parser-chinese";

export const hasFullwidthInEn = rule(':ZH417', (tree, file) => {

  // eng use half, chinese use full
  visit(tree, "SentenceNode", (sentence: any) => {
    // 英文句子检测
    if (!sentence.isFull) {
      visitChildren(sentence, Punctuation, (text) => {
        if (text.isFull) {
          if (text.ptype === PUNCTUATION.COLON) {
              return
          }
          file.message(`shouldn't use full-width char:'${text.value}' in en sentence`, text?.position?.start);
        }
      });
    }
  })
})
export const ZH417 = hasFullwidthInEn;
