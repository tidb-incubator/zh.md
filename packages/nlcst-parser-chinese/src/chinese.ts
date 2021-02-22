import {ChineseParser} from "./parser";

export const Chinese = function(this: {Parser: unknown}) {
  this.Parser = ChineseParser
}
