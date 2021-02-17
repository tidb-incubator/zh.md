import {isStartOrEndInArray, rule, visit} from "./utils";
import {isWhiteSpace} from "nlcst-types";
import {isSlash, Punctuation} from "retext-chinese";
import * as ZHError from "./error";

// 斜杠前后不准有空格
export const ZH414 = rule(":ZH414", (tree, file) => {
  visit(tree, "SentenceNode", (_sen: any) => {
    visit(_sen, Punctuation, (node, i, parent)=>{
      if(isSlash(node) && !isStartOrEndInArray(i, parent.children)){
        if (isWhiteSpace(parent.children[i-1])){
          file.message(
            ZHError.ZH414L,
            node?.position?.start
          );
        }

        if (isWhiteSpace(parent.children[i+1])){
          file.message(
            ZHError.ZH414R,
            node?.position?.end
          );
        }

      }
    })

  });
});
