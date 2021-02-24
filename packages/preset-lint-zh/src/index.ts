import { plugins as lintZhPlugins} from "lint-zh";

export const plugins = [
  require("remark-gfm"),
  require("remark-lint"),
  [require("remark-frontmatter"), ["yaml", "toml"]],
  {...lintZhPlugins},
]