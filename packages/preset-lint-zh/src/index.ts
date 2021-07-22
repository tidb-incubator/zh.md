#! /usr/bin/env node

import {ZH400, ZH403, ZH416, ZH417, ZH418, ZH420_423, ZH425} from "lint-zh/lib";
import {Chinese} from "nlcst-parser-chinese";
import unified = require("unified");
import {VFile} from "vfile";
import {IIgnore} from "./ignore";
import {processIgnore} from "./process";

var stringify = require('remark-stringify')

const vfile = require("to-vfile");
var report = require('vfile-reporter')

var remark2retext = require("remark-retext");

const remark = require("remark");
const gfm = require("remark-gfm");
const frontmatter = require("remark-frontmatter");
const yaml = require('js-yaml');
const fs = require('fs');
const Path = require('path');


const {program} = require('commander');

program.version('0.0.1');
program
  .option('-c, --config <type>', 'config file path')
program.parse(process.argv);

const options = program.opts();
const unifiedWrap: any = unified;

export const remark_zh = remark()
  .use(gfm)
  .use(frontmatter, ["yaml", "toml"])
  .use(
    remark2retext,
    unifiedWrap()
      .use(Chinese)
      .use(ZH400)
      .use(ZH403)
      // .use(ZH414)
      .use(ZH416, [2])
      .use(ZH417, [2])
      .use(ZH418, [2])
      .use(ZH420_423)
      .use(ZH425)
  ).use(stringify)


const rootPath = Path.dirname(options.config)
const config = yaml.load(fs.readFileSync(options.config, 'utf8'));

const glob = require("glob")
const total: any = []

let paths = new Set<string>();
(config.includes || []).forEach((path: any) => {
  glob.sync(Path.join(rootPath, path), {}).map((file: any) => paths.add(file))
});

(config.excludes || []).forEach((path: any) => {
  glob.sync(Path.join(rootPath, path), {}).map((file: any) => paths.delete(file))
});


const ignoreConfigs = new Map<string, IIgnore[]>();
(config.ignore || []).forEach((i: IIgnore) => {
  const path = Path.join(rootPath, i.path)
  ignoreConfigs.set(path, [...(ignoreConfigs.get(path) || []), i])
})

let isError = false
let isFailed = false
paths.forEach(path => remark_zh.process(vfile.readSync(path), function (err: any, file: VFile) {
  total.push(...(file?.messages || []))
  const ignoreConfig = ignoreConfigs.get(path)
  if (ignoreConfig) {
    file = processIgnore(file, ignoreConfig)
  }
  if (err) {
    console.error(report(err))
  }

  if (file.messages.length > 0) {
    isFailed = true
  }
  file.messages.forEach(msg => {
    if (msg.fatal) {
      isError = true
    }
  })
  console.error(report(file))
}))

if (isFailed && config?.failed_msg) {
  console.log('\n','\x1b[41m', config?.failed_msg ,'\x1b[0m');
}

if (isError) {
  process.exit(1)
}
