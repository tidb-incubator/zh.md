var inspect = require('unist-util-inspect')
var {Chinese} = require('./lib/index')

var tree = new Chinese().parse(
  '宋代著名学者朱熹对此章评价极高，说它是「入道之门，积德之基」。本章这三句话是人们非常熟悉的。'
)

console.log(inspect(tree))


 tree = new Chinese().parse(
  '这是一个例句( Example )。'
)

console.log(inspect(tree))