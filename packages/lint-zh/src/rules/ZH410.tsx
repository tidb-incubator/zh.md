import {rule, visit} from "./utils";
import {isHyphen, Punctuation} from "retext-chinese";
import {isWhiteSpace} from "nlcst-types";
import {isStartOrEndInArray} from "retext-chinese/lib/parser";
import {ZHError} from "./error";

// 连接与破折号前后不准有空格
export const ZH410 = rule(":ZH410", (tree, file) => {
  visit(tree, "SentenceNode", (_sen: any) => {
    visit(_sen, Punctuation, (node, i, parent) => {
      if (isHyphen(node) && !isStartOrEndInArray(i, parent.children)) {
        if (isWhiteSpace(parent.children[i - 1])) {
          file.message(
            ZHError.ZH410L,
            node?.position?.start
          );
        }

        if (isWhiteSpace(parent.children[i + 1])) {
          file.message(
            ZHError.ZH410R,
            node?.position?.end
          );
        }

      }
    })

  });
});
