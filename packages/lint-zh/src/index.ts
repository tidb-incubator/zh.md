import {ZH410} from "./rules/ZH410";
import {ZH400} from "./rules/ZH400-limit-comma-count";
import {ZH401} from "./rules/ZH401-limit-pause-count";
import {ZH403} from "./rules/ZH403-limit-cn-colon";
import {ZH414} from "./rules/ZH414";
import {ZH416} from "./rules/ZH416";
import {ZH420_423} from "./rules/ZH420_423";
import {ZH417} from "./rules/ZH417";
import {ZH425} from "./rules/ZH425";
import {ZH418} from "./rules/ZH418";
import {Chinese} from "nlcst-parser-chinese";

export const plugins = [
  [
    require("remark-retext"),
    require("unified")()
      .use(Chinese)
      .use(ZH400)
      .use(ZH403)
      // .use(ZH410)
      .use(ZH414)
      .use(ZH416)
      .use(ZH417)
      .use(ZH418)
      .use(ZH420_423)
      .use(ZH425)
  ],
]
export {ZH400, ZH401, ZH403, ZH410, ZH414, ZH416, ZH417, ZH418, ZH420_423, ZH425}
