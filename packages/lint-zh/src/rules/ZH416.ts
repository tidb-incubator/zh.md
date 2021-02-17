//。！？：
import {PUNCTUATION} from "retext-chinese";
import {rule, visit} from "./utils";
import {isPunctuation} from "nlcst-types";
import {isComma} from "retext-chinese/lib";
import * as ZHError from "./error";

const ALLOW_END_PUNCTUATION = [
  PUNCTUATION.STOP,
  PUNCTUATION.QUESTION,
  PUNCTUATION.EXCLAMATION,
  PUNCTUATION.COLON
];

export const ZH416 = rule(":ZH416", (tree, file) => {
  visit(tree, "SentenceNode", (sentence: any) => {
    if (!sentence.index.punctuation) {
      return;
    }

    const hasComma = sentence.children.filter((s:Node) => isPunctuation(s) && isComma(s)).length > 0

    if (!hasComma) {
      return;
    }

    const lastNode = sentence.children[sentence.children.length - 1];
    if (!isPunctuation(lastNode)) {
      file.message(
        ZHError.ZH416,
        sentence.position.end
      );
      return;
    }
    if (ALLOW_END_PUNCTUATION.indexOf(lastNode.ptype) === -1) {
      file.message(
        `sentence ending punctuation '${lastNode.value}' is illegal`,
        sentence.position.end
      );
      return;
    }
  });
});
