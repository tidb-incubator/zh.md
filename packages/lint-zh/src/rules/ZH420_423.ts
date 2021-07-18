import {isPunctuation, isWhiteSpace, isWord} from "nlcst-types";
import {lintRule, visit} from "./utils";
import {isLeftParenthesis, isRightParenthesis, SentenceNode} from "nlcst-parser-chinese";
import * as ZHError from "./error";


//括号里全为英文时建议使用半角括号，并在括号前后各空一个半角空格，括号和括号内的英文之间不需要空格。
// 【错误420】数据定义语言（DDL）是一种……（使用了全角括号）
// 【错误421】数据定义语言(DDL)是一种……（半角括号前后未空格）
// 【错误422】数据定义语言 ( DDL ) 是一种……（半角括号和半角括号内的英文之间空了一格）
// 【正确示例】数据定义语言 (DDL) 是一种……
// 括号里既有中文又有英文（即只要括号内包含任何中文）时建议使用全角括号，括号前后不空格。
// 【错误423】斜杠 (slash 或 forward slash) 和反斜杠 (backslash) 是两种符号。
// 【正确示例】斜杠（slash 或 forward slash）和反斜杠 (backslash) 是两种符号。
export const ZH420_423 = lintRule("", (tree, file) => {
  visit(tree, "SentenceNode", (_sen: any) => {
    const sen: SentenceNode = _sen;
    let left;
    let left_i=-1;
    let cache = []
    let i = -1;
    for (let child of sen.children) {

      i += 1;
      if (isPunctuation(child)) {
        if (isLeftParenthesis(child)) {
          if (left) {
            file.message(ZHError.ZH423R, child?.position?.start, "ZH423")
            continue
          }
          left = child
          left_i = i
          continue
        }

        if (isRightParenthesis(child)) {
          if (!left) {
            file.message(ZHError.ZH423L, child?.position?.start, "ZH423")
            continue
          }

          // DEEP CHECK
          const isCN = cache.filter(n => isWord(n)).filter(n => n.isFull).length > 0
          const hadStartSpace = left_i !== 0 && isWhiteSpace(sen.children[left_i - 1])
          const hadEndSpace = i + 1 !== sen.children.length - 1 && isWhiteSpace(sen.children[i + 1])


          if (isCN) {
            if (!left.isFull) {
              file.message(ZHError.ZH424L, left?.position?.start, "ZH424")
            }
            if (!child.isFull) {
              file.message(ZHError.ZH424R, child?.position?.start, "ZH424")
            }

            if (hadStartSpace) {
              file.message(ZHError.ZH423WL, left?.position?.start, "ZH423")
            }
            if (hadEndSpace) {
              file.message(ZHError.ZH423WR, child?.position?.start, "ZH423")
            }
          } else {
            if (left.isFull) {
              file.message(ZHError.ZH420L, left?.position?.start, "ZH420L")
            }
            if (child.isFull) {
              file.message(ZHError.ZH420R, child?.position?.start, "ZH420R")
            }

            if (left_i !== 0 && !hadStartSpace) {
              file.message(ZHError.ZH421L, left?.position?.start, "ZH421")
            }
            if (i !== (sen.children.length - 1) && !hadEndSpace) {
              file.message(ZHError.ZH421R, child?.position?.start, "ZH421")
            }

            if (cache.length > 0) {
              if (isWhiteSpace(cache[0])) {
                file.message(ZHError.ZH422L, child?.position?.start, "ZH422")
              }
              if (isWhiteSpace(cache[cache.length - 1])) {
                file.message(ZHError.ZH422R, child?.position?.start, "ZH422")
              }
            }


          }

          // clear
          cache = []
          left = undefined
        }
      }
      if (left) {
        cache.push(child)
      }

    }

    if (left) {
      file.message(ZHError.ZH423R, sen.position.end, "ZH423R")
    }
  });
});

