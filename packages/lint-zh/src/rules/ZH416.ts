//。！？：
import {isComma, isLeftParenthesis, PUNCTUATION, isRightParenthesis} from "nlcst-parser-chinese";
import {rule, visit} from "./utils";
import * as ZHError from "./error";
import {isPunctuation} from "nlcst-types";
import {Node} from "unist";

const ALLOW_END_PUNCTUATION = [
  PUNCTUATION.STOP,
  PUNCTUATION.QUESTION,
  PUNCTUATION.EXCLAMATION,
  PUNCTUATION.COLON,
  PUNCTUATION.RIGHT_PARENTHESIS
];

export const ZH416 = rule(":ZH416", (tree, file) => {
  visit(tree, "SentenceNode", (sentence: any) => {
    if (!sentence.index.punctuation) {
      return;
    }

    const hasComma = sentence.children.filter((s: Node) => isPunctuation(s) && isComma(s)).length > 0

    if (!hasComma) {
      return;
    }

    let lastNode = sentence.children[sentence.children.length - 1];
    if (!isPunctuation(lastNode)) {
      file.message(
        ZHError.ZH416,
        sentence.position.end
      );
      return;
    }
    // if end char is ")", check the char before "("
    if (isRightParenthesis(lastNode)) {
      sentence.children.forEach((node: Node, i: number) => {
        if (isLeftParenthesis(node) && i > 0) {
          lastNode = sentence.children[i - 1]
        }
      })
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
