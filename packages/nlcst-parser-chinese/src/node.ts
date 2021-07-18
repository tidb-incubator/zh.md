import {Position, Node} from "unist";
import {PUNCTUATION} from "./punctuation";

export const Text = "TextNode"
export const Punctuation = "PunctuationNode"
export const Paragraph= "ParagraphNode"
export const Sentence= "SentenceNode"
export const Word= "WordNode"
export const WhiteSpace= "WhiteSpaceNode"

export interface SentenceNode extends Node{
  isFull?: boolean
  children: any[]
  position: Position
  level: number
}


export interface PunctuationNode extends Node {
  value: string
  ptype: PUNCTUATION
}
