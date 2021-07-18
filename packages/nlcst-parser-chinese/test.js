var inspect = require('unist-util-inspect')
const { ChineseParser } = require("./lib");

// var tree = new ChineseParser().parse(
//   '宋代著名学者朱熹对此章评价极高，说它是「入道之门，积德之基」。本章这三句话是人们非常熟悉的。'
// )
// console.log(inspect(tree))


// tree = new ChineseParser().parse(
//   "已删除任务（只在指定 `--all` 选项时才会显示该状态的任务。未指定时，可通过 `query` 查询该状态的任务）。未删除任务。"
// )
// console.log(inspect(tree))
// tree = new ChineseParser().parse(
//   "--sort-engine：指定 changefeed 使用的排序引擎。因 TiDB 和 TiKV 使用分布式架构，TiCDC 需要对数据变更记录进行排序后才能输出。该项支持 unified（默认）/memory/file："
// )
// console.log(inspect(tree))
tree = new ChineseParser().parse(
  "MySQL Connector/Net：.Net 语言的客户端库，MySQL for Visual Studio使用这个库，支持 Microsoft Visual Studio 2012，2013，2015和2017版本"
)
console.log(inspect(tree))
