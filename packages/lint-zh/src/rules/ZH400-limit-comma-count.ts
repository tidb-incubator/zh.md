import {isComma} from "nlcst-parser-chinese";
import {baseCountRule} from "./utils";

export const limitCommaCount = baseCountRule(":ZH400", "comma", isComma, "lt", 6)
export const ZH400 = limitCommaCount;