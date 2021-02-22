import {baseCountRule} from "./utils";
import {isCnCOLON} from "nlcst-parser-chinese";

export const limitCnColon = baseCountRule(":ZH403", "colon'：'", isCnCOLON, "lt", 1)
export const ZH403 = limitCnColon;

