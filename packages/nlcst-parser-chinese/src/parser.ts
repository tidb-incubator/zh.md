import {isPunctuation, isSymbol, Root} from "nlcst-types";
import * as NODE_TYPE from "./node";
import {PunctuationNode, SentenceNode} from "./node";
import stringWidth from "string-width";
import {Node, Parent} from "unist";
import {isHyphen, PUNCTUATION, punctuationNodeSetMeta} from "./punctuation";

const toString = require("nlcst-to-string");
const visit = require("unist-util-visit");
const English = require("parse-english");


const NEWLINE_CHARS = [PUNCTUATION.STOP, PUNCTUATION.QUESTION, PUNCTUATION.EXCLAMATION, PUNCTUATION.SEMICOLON];


const isNewSubSentence = (node: Node) => {
  if (isPunctuation(node)) {
    return [PUNCTUATION.LEFT_PARENTHESIS, PUNCTUATION.LEFT_DOUBLE_QUOTATION_MARK].indexOf(node.ptype) > -1
  }
  return false
}

const getEndPunctuation = (node: Node) => {
  switch (node.ptype) {
    case PUNCTUATION.LEFT_PARENTHESIS:
      return PUNCTUATION.RIGHT_PARENTHESIS
    case PUNCTUATION.LEFT_DOUBLE_QUOTATION_MARK:
      return PUNCTUATION.RIGHT_DOUBLE_QUOTATION_MARK
    default:
      return PUNCTUATION.END
  }
}

type IRebuildSentence = (_nodes: Node[], level: number, start?: Node) => Node[]
const rebuildSentence: IRebuildSentence = (_nodes, level, start) => {
  let children = _nodes
  // always can't met
  const end = start ? getEndPunctuation(start) : PUNCTUATION.END
  let i = 0
  while (true) {
    if (i >= children.length) {
      break
    }


    if (isPunctuation(children[i])) {
      const p: Node = children[i];

      if (p.ptype === end) {
        const sentence = createNewSentence([...(start ? [start] : []), ...children.slice(0, i + 1)], level)
        return [sentence, ...children.slice(i + 1)]
      }

      if (isNewSubSentence(p)) {
        const newChildren = rebuildSentence(children.slice(i + 1), level + 1, children[i])
        children = [...children.slice(0, i - 1), ...newChildren]
      }

    }

    i++
  }
  return children
}


function rebuildSentenceWrap(tree: Root) {
  visit(tree, NODE_TYPE.Paragraph, (parent: any) => {
    // level 1, subSentence(level>0). e.g. (["'
    for (let n of parent.children) {
      if (n.type === NODE_TYPE.Sentence) {
        let sentence: SentenceNode = n
        sentence.children = rebuildSentence(sentence.children, 0)
        sentence.level = 0
      }
    }
    // full width end char, e.g. 。！？
    // 对 level 为 0 的 Sentence 进行结尾符号检测
    let newChildren: Node[] = []
    parent.children.forEach((n: Node) => {
      if (n.type !== NODE_TYPE.Sentence) {
        newChildren.push(n)
        return

      }
      let stack = []
      for (let node of n.children as Node[]) {
        stack.push(node)
        if (isPunctuation(node) && NEWLINE_CHARS.indexOf(node.ptype) > -1 && node.isFull) {
          newChildren.push(createNewSentence(stack, 0))
          stack = []
        }
      }
      if (stack.length > 0) {
        newChildren.push(createNewSentence(stack, 0))
      }
    })

    parent.children = newChildren

    //  对 " ` 包围的词进行处理
    visit(tree, NODE_TYPE.Sentence, (sentence: SentenceNode) => {
      let newChild = []
      for (let i = 0; i < sentence.children.length; i++) {
        let child = sentence.children[i]
        if ('`"“'.indexOf(child.value) > -1) {
          let expect = child.value
          if (expect === "“") {
            expect = "”"
          }
          for (let j = i + 1; j < sentence.children.length; j++) {
            if (sentence.children[j].value === expect) {
              // set jump
              child = createNode(sentence.children.slice(i, j + 1), "WordNode")
              child.value = sentence.children.slice(i, j + 1).map(v => v.value).join()
              i = j
            }
          }
        }
        newChild.push(child)
      }
      sentence.children = newChild
    })

  })
}


function checkFirst(sen: SentenceNode, check: (node: Node) => boolean) {
  if (sen.children.length > 0) {
    return check(sen.children[0])
  }
  return false;
}

function checkLast(sen: SentenceNode, check: (node: Node) => boolean) {
  if (sen.children.length > 0) {
    const node = sen.children[sen.children.length - 1]
    return check(node)
  }
  return false;
}


function mergeSentence(tree: Root) {
  visit(tree, NODE_TYPE.Paragraph, (parent: any) => {
    let newChildren: Node[] = []
    for (let node of parent.children) {
      let shouldAdd = true
      if (node.type === NODE_TYPE.Sentence
        && newChildren.length > 0
        && newChildren[newChildren.length - 1].type === NODE_TYPE.Sentence) {

        const last = newChildren[newChildren.length - 1] as SentenceNode
        if (checkFirst(node as SentenceNode, (node) => toString(node).toLowerCase() === "net") &&
          checkLast(last, (node) => isPunctuation(node) && (node as PunctuationNode).value === ".")
        ) {
          shouldAdd = false
          const newStart = last.children[last.children.length - 1].position.start
          node.children[0].children[0].value = "." + node.children[0].children[0].value
          node.children[0].children[0].position.start = newStart
          node.children[0].position.start = newStart

          newChildren[newChildren.length - 1] = createNewSentence([...last.children.slice(0, last.children.length - 1), ...node.children], 0)
        }
      }

      if (shouldAdd) {
        newChildren.push(node)
      }
    }
    parent.children = newChildren
  })
}

function addSentenceMeta(tree: Root) {
  visit(tree, NODE_TYPE.Paragraph, (parent: any) => {
    let children = [];
    for (let node of parent.children) {
      if (node.type === NODE_TYPE.Sentence) {
        let sentenceChildren = [];

        for (let sentence_node of node.children) {
          sentenceChildren.push(sentence_node);
          if (sentence_node.type === NODE_TYPE.Word) {
            const v = toString(sentence_node);
            sentence_node.isFull = v.length !== stringWidth(v);
          }
        }
        if (sentenceChildren.length > 0) {
          let sen = createNewSentence(sentenceChildren, node.level || 0);
          if (!isShortCode(sen)) {
            children.push(createNewSentence(sentenceChildren, node.level || 0));
          }
        }

        visit(node, ["TextNode", "PunctuationNode"], (node: any, i: number, parent: Parent) => {
          if (node.type === "TextNode") {
            node.isFull = node.value.length !== stringWidth(node.value);
          } else if (node.type === "PunctuationNode") {
            punctuationNodeSetMeta(node);
            if (isHyphen(node) && !isStartOrEndInArray(i, parent.children)) {
              const last = parent.children[i - 1];
              const next = parent.children[i + 1];
              if (isSymbol(last) && last.value === "<") {
                last.value = "<-"
                parent.children.splice(i, 1)
              } else if (isSymbol(next) && next.value === ">") {
                last.value = "->"
                parent.children.splice(i, 1)
              }

            }
          }
        });

      } else {
        children.push(node);
      }
    }


    parent.children = children;
  });

}


function setSentenceIsFull(sentence: Parent) {

  sentence.isFull = false;
  sentence.index = {punctuation: 0};


  for (let node of sentence.children) {
    if (node.type === NODE_TYPE.Word) {
      sentence.isFull = node.isFull || sentence.isFull;
    }
    if (node.type === NODE_TYPE.Sentence) {
      setSentenceIsFull(node as Parent)
      sentence.isFull = node.isFull || sentence.isFull;
    }
  }
}


function setSentenceIsFullWrap(tree: Parent) {
  visit(tree, NODE_TYPE.Paragraph, (parent: any) => {
    for (let node of parent.children) {
      if (node.type === NODE_TYPE.Sentence) {
        setSentenceIsFull(node)

      }
    }
  })
}


function isShortCode(sen: Parent) {
  let first, last;
  for (let child of sen.children) {
    if (isPunctuation(child)) {
      if (!first) {
        first = child;
      }
      last = child;
    }
  }

  return isPunctuation(first) &&
    first.value === "{{" &&
    isPunctuation(last) &&
    last.value === "}}";
}


export const isStartOrEndInArray = (i: number, children: Node[]) => {
  return i === 0 || children.length - 1 === i;
};

const defaultPointError = {line: 0, column: 0}

function createNewSentence(children: Node[], level: number): SentenceNode {
  const start = children[0];
  const end = children[children.length - 1];
  return {
    level: level,
    type: "SentenceNode",
    children: children,
    position: {
      start: start.position ? start.position.start : defaultPointError,
      end: end.position ? end.position.end : defaultPointError
    },
  };
}

function createNode(children: Node[], type: string): Node {
  const start = children[0];
  const end = children[children.length - 1];
  return {
    type: type,
    children,
    position: {
      start: start.position ? start.position.start : defaultPointError,
      end: end.position ? end.position.end : defaultPointError
    },
  }
}

type CreateNodeFn = (value: string, eat: Node, parent: Node) => Node

export class ChineseParser {
  parser: {
    tokenize: (text: string) => Root,
    parse: (text: string) => Root,
    tokenizeSymbol: CreateNodeFn,
    tokenizeWhiteSpace: CreateNodeFn,
    tokenizePunctuation: CreateNodeFn,
    tokenizeSource: CreateNodeFn,
    tokenizeText: CreateNodeFn,
  };

  constructor() {
    this.parser = new English();
  }

  tokenize(text: string) {
    return this.parser.tokenize(text)
  }

  parse(text: string): Root {
    const root = this.parser.parse(text)
    mergeSentence(root)
    addSentenceMeta(root)
    rebuildSentenceWrap(root)
    setSentenceIsFullWrap(root)
    return root
  }

  tokenizeText: CreateNodeFn = (value, eat, parent) => {
    return this.parser.tokenizeText(value, eat, parent)
  }
  tokenizeSource: CreateNodeFn = (value, eat, parent) => {
    return this.parser.tokenizeSource(value, eat, parent)
  }
  tokenizePunctuation: CreateNodeFn = (value, eat, parent) => {
    return this.parser.tokenizePunctuation(value, eat, parent)
  }
  tokenizeWhiteSpace: CreateNodeFn = (value, eat, parent) => {
    return this.parser.tokenizeWhiteSpace(value, eat, parent)
  }
  tokenizeSymbol: CreateNodeFn = (value, eat, parent) => {
    return this.parser.tokenizeSymbol(value, eat, parent)
  }

}
