import {Position, Node} from "unist";

export const Text = "TextNode"
export const Punctuation = "PunctuationNode"
export const Paragraph= "ParagraphNode"
export const Sentence= "SentenceNode"
export const Word= "WordNode"
export const WhiteSpace= "WhiteSpaceNode"

export interface SentenceNode extends Node{
  isFull: boolean
  children: any[]
  position: Position
}


export interface PunctuationNode extends Node {
  value: string
}
