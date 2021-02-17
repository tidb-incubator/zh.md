import {ZH400, ZH401, ZH403, ZH410, ZH414, ZH416, ZH417, ZH418, ZH420_423, ZH425} from "lint-zh";

export const plugins = [
  require("remark-gfm"),
  [require("remark-frontmatter"), ["yaml", "toml"]],
  require("remark-retext"),
  require("unified")()
    .use(require("retext-chinese/lib/remark-chinese"))
    .use(ZH400)
    .use(ZH401)
    .use(ZH403)
    .use(ZH410)
    .use(ZH414)
    .use(ZH416)
    .use(ZH417)
    .use(ZH418)
    .use(ZH420_423)
    .use(ZH425),
  require("remark-stringify"),
]