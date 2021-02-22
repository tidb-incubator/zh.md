import {Node} from "unist";
import {PunctuationNode} from "./node";

export enum PUNCTUATION {
  STOP,
  COMMA,
  DOUBLE_QUOTATION_MARK,
  SINGLE_QUOTATION_MARK,
  HYPHEN,
  QUESTION,
  COLON,
  EXCLAMATION,
  SEMICOLON,
  PAUSE,
  SLASH,
  LEFT_PARENTHESIS,
  RIGHT_PARENTHESIS,
  ELLIPSIS,
  LEFT_DOUBLE_QUOTATION_MARK,
  RIGHT_DOUBLE_QUOTATION_MARK,

  UNKNOWN
}

export interface PUNCTUATION_META {
  name: PUNCTUATION,
  isFull: boolean,
  isCN: boolean,
  alias: string,
}
const pMAP:Record<string, PUNCTUATION_META> = {}

function createP(name: PUNCTUATION, v: string, isFull = false, ensureCN = false, alias = "") {
  pMAP[v] = {
    name,
    isFull,
    isCN: ensureCN || isFull,
    alias
  }
}


createP(PUNCTUATION.STOP, ".", false)
createP(PUNCTUATION.STOP, "。", true)

createP(PUNCTUATION.COMMA, ",", false)
createP(PUNCTUATION.COMMA, "，", true)


createP(PUNCTUATION.DOUBLE_QUOTATION_MARK, '"', false)
createP(PUNCTUATION.SINGLE_QUOTATION_MARK, "'", false)


createP(PUNCTUATION.HYPHEN, '–', false, true, "一字线")
createP(PUNCTUATION.HYPHEN, "-", false, false, "半字线")
createP(PUNCTUATION.HYPHEN, "—", true, true, "短划线")
createP(PUNCTUATION.HYPHEN, "——", true, true, "长横")

createP(PUNCTUATION.QUESTION, '?', false)
createP(PUNCTUATION.QUESTION, "？", true)

createP(PUNCTUATION.COLON, ':', false)
createP(PUNCTUATION.COLON, "：", true)

createP(PUNCTUATION.EXCLAMATION, '!', false)
createP(PUNCTUATION.EXCLAMATION, "！", true)

createP(PUNCTUATION.SEMICOLON, ';', false)
createP(PUNCTUATION.SEMICOLON, "；", true)

createP(PUNCTUATION.PAUSE, "、", true)

createP(PUNCTUATION.SLASH, '/', false, true)

createP(PUNCTUATION.LEFT_PARENTHESIS, '(', false, true)
createP(PUNCTUATION.LEFT_PARENTHESIS, "（", true)

createP(PUNCTUATION.RIGHT_PARENTHESIS, ')', false, true)
createP(PUNCTUATION.RIGHT_PARENTHESIS, "）", true)


createP(PUNCTUATION.ELLIPSIS, "...", false)
createP(PUNCTUATION.ELLIPSIS, "......", false, true)

createP(PUNCTUATION.LEFT_DOUBLE_QUOTATION_MARK, "“", true)
createP(PUNCTUATION.RIGHT_DOUBLE_QUOTATION_MARK, "”", true)



export const punctuationNodeSetMeta: (node: PunctuationNode) => void = node => {
  const meta = pMAP[node.value] || {name: PUNCTUATION.UNKNOWN}
  node.ptype = meta.name
  node.isFull = meta.isFull
  node.isCN = meta.isCN
  return;
};


export const isComma: NodeCheckFunc = (node) => {
  return node.ptype === PUNCTUATION.COMMA
}

export const isHyphen: NodeCheckFunc = (node) => {
  return node.ptype === PUNCTUATION.HYPHEN
}
export const isSlash: NodeCheckFunc = (node) => {
  return node.ptype === PUNCTUATION.SLASH
}
export const isPause: NodeCheckFunc = (node) => {
  return node.ptype === PUNCTUATION.PAUSE
}

export const isCnCOLON: NodeCheckFunc = (node) => {
  return node.ptype === PUNCTUATION.COLON && node.isCN === true
}

export const isLeftParenthesis: NodeCheckFunc = (node) => {
  return node.ptype === PUNCTUATION.LEFT_PARENTHESIS
}


export const isRightParenthesis: NodeCheckFunc = (node) => {
  return node.ptype === PUNCTUATION.RIGHT_PARENTHESIS
}

export type NodeCheckFunc = (node: Node) => boolean;
