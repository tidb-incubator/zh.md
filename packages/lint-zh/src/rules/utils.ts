import {Punctuation} from "nlcst-parser-chinese";

const r = require("unified-lint-rule")
import v = require("unist-util-visit");
import {Node, Parent, Point} from "unist"
import {NodeCheckFunc} from "nlcst-parser-chinese";
import {Sentence} from "nlcst-types";


type visitI = (tree: Parent, type: string, cb: (node: Sentence | Parent, index: number, parent: Parent) => void) => void
// @ts-ignore
export const visit: visitI = v;

export interface VFile {
  message: (msg: string, node?: Node | Point, ruleId?: string) => void
}

export const rule: ruleI = r

type ruleI = (name: string, fn: (node: Parent, file: VFile, options: any) => void) => void

export type visitorFn = (node: Parent, i: number, parent: Parent) => void

export const visitChildren = (tree: Parent, match: string, fn: visitorFn) => {
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type === match) {
      fn(node as Parent, i, tree);
    }
  }
};
export const baseCountRule = (name: string, punctuationName: string, matchFunc: NodeCheckFunc, eq: string, default_limit: number) => {
  return rule(name, (tree, file, options = {limit: default_limit}) => {
    const limit = options.limit;
    visit(tree, "SentenceNode", (sentence: any) => {
      let count = 0;
      visitChildren(sentence, Punctuation, (pnode) => {
        if (matchFunc(pnode)) {
          count += 1;
        }
      });
      if (eq === "lt" && count > limit) {
        file.message(`sentence ${punctuationName} count:${count}, bigger than limit:${limit}`, sentence)
      }
      if (eq === "gt" && count !== 0 && count < limit) {
        file.message(`sentence ${punctuationName} count:${count}, smaller than limit:${limit}`, sentence)
      }
    });
  })
}


export const getNear = (i: number, children: Node[]) => {
  let last = i !== 0 ? children[i - 1] : undefined
  let next = (i + 1) !== children.length ? children[i + 1] : undefined

  return {
    last,
    next
  }

}

export const isStartOrEndInArray = (i: number, children: Node[]) => {
  return i === 0 || children.length - 1 === i;
};
