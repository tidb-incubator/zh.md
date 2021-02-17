// import * as assert from "assert";

import "mocha"
import {plugins} from "../src/index";

import {expect} from "chai"
import {ZHError} from "../src/rules/error";

const remark = require("remark");


const exceptOneMsg = (output: any, msg: string) => {
  expect(output.messages.length).equal(1)
  expect(output.messages[0].message).equal(msg)
}

describe('zh.md rules', function () {
  it('ZH400', function () {
    const output = remark().use(plugins).processSync(
      "这是一个桔子，他的，数量很多，巴巴，巴巴，他们都去，哪里了，呀？"
    );
    exceptOneMsg(output, "sentence comma count:7, bigger than limit:6")
  });

  it('ZH403', () => {
    const output = remark().use(plugins).processSync(
      "这是一个桔子，那也是个桔子，具体详情看：http://zh.md，详细内容："
    );
    exceptOneMsg(output, "sentence colon'：' count:2, bigger than limit:1")
  })

  it('ZH410', function () {
    const output = remark().use(plugins).processSync(
      "哇，是破-折 ——号！"
    );
    expect(output.messages.length).equal(1)
    expect(output.messages[0].ruleId).equal("ZH410")
  });

  it('ZH412', function () {
    const output = remark().use(plugins).processSync(
      "大爷你该走哪？走二仙桥！谭警官：..."
    );
    exceptOneMsg(output,  "shouldn't use en ellipsis:'...' in cn sentence")
  });


  it('ZH414', function () {
    const output = remark().use(plugins).processSync(
      "接/化 / 发，不讲武德？no jiang / wu / de"
    );
    expect(output.messages.length).equal(6)
    expect(output.messages[5].ruleId).equal("ZH414")
  });


  it('ZH416_0', function () {
    const output = remark().use(plugins).processSync(
      "哇！啪一下，很快的啊"
    );
    exceptOneMsg(output,  ZHError.ZH416)
  });

  it('ZH416_1', function () {
    const output = remark().use(plugins).processSync(
      "哇！啪一下，很快的啊，"
    );
    exceptOneMsg(output,  "sentence ending punctuation '，' is illegal")
  });



  it('ZH417', function () {
    const output = remark().use(plugins).processSync(
      "english sen can't use “it\". "
    );
    exceptOneMsg(output,  "shouldn't use full-width char:'“' in en sentence")
  });

  it('ZH423_0', function () {
    const output = remark().use(plugins).processSync(
      "这是一个测试句子（啥这是一个测试句子？ "
    );
    exceptOneMsg(output,  ZHError.ZH423R)
  });

  it('ZH423_1', function () {
    const output = remark().use(plugins).processSync(
      "这是一个测试句子啥这是一个测试句子）？"
    );
    exceptOneMsg(output,  ZHError.ZH423L)
  });


  it('ZH424_0', function () {
    const output = remark().use(plugins).processSync(
      "这是一个测试句 (子啥这是一个测试) 句子？"
    );
    expect(output.messages[0].message).equal(ZHError.ZH424L)
    expect(output.messages[1].message).equal(ZHError.ZH424R)
  });

  it('ZH423_2', function () {
    const output = remark().use(plugins).processSync(
      "这是一个测试句 （子啥这是一个测试） 句子？"
    );
    expect(output.messages[0].message).equal(ZHError.ZH423WL)
    expect(output.messages[1].message).equal(ZHError.ZH423WR)
  });

  it('ZH420', function () {
    const output = remark().use(plugins).processSync(
      "这是一个测试句（hello world）句子？"
    );
    expect(output.messages[0].message).equal(ZHError.ZH420L)
    expect(output.messages[1].message).equal(ZHError.ZH420R)
  });

  it('ZH421', function () {
    const output = remark().use(plugins).processSync(
      "这是一个测试句(hello world)句子？"
    );
    expect(output.messages[0].message).equal(ZHError.ZH421L)
    expect(output.messages[1].message).equal(ZHError.ZH421R)
  });

  it('ZH422', function () {
    const output = remark().use(plugins).processSync(
      "这是一个测试句 ( hello world ) 句子？"
    );
    expect(output.messages[0].message).equal(ZHError.ZH422L)
    expect(output.messages[1].message).equal(ZHError.ZH422R)
  });
  it('ZH425', function () {
    const output = remark().use(plugins).processSync(
      "请将具体的日志提供给  TiDB 开发者。"
    );
    exceptOneMsg(output,  ZHError.ZH425)
  });

  it('ZH426', function () {
    const output = remark().use(plugins).processSync(
      "请将具体的日志 提供给 TiDB 开发者。"
    );
    exceptOneMsg(output,  ZHError.ZH426)
  });

  it('ZH427', function () {
    const output = remark().use(plugins).processSync(
      "请将具体的日志提供给， TiDB 开发者。"
    );
    exceptOneMsg(output,  ZHError.ZH427)
  });

  it('ZH428', function () {
    const output = remark().use(plugins).processSync(
      "这好吗？ 这不好。这不讲武德！"
    );
    exceptOneMsg(output,  ZHError.ZH428)
  });

});

