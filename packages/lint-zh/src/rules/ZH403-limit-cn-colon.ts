import {baseCountRule} from "./utils";
import {isCnCOLON} from "retext-chinese";

export const limitCnColon = baseCountRule(":ZH403", "colon'：'", isCnCOLON, "lt", 1)
export const ZH403 = limitCnColon;

