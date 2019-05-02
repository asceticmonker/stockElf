const fs = require('fs');
const db = require('./model/db')

var data = fs.readFileSync("./static/cache.txt", 'utf-8')
var arr = data.split("\n");

let newArr = []
let time = "2019-04-30"
for (let i=0; i<arr.length; i++) {
  let stockInfo = {
    '_id': '',
    'stockName': '',
    'stockNum': '',
    'stockfield': [],
    'ztInfo': [],
    'lastEditTime': ''
  }
  let itemi = arr[i].split("  ");
  stockInfo['_id'] = itemi[0].trim()
  stockInfo['stockNum'] = itemi[0].trim()
  stockInfo['stockName'] = itemi[1].trim()
  stockInfo['lastEditTime'] = time;
  stockInfo['ztInfo'] = [{
    zttime: time,
    Zrange: "zt",
    Ztreason: ""
  }]
  newArr.push(stockInfo)
}

// console.log(JSON.stringify(newArr, null, '\t'))
async function insertMany(name, obj) {
  let result = await db.insertMany(name, obj)
  console.log(result)
}
insertMany('stockZt',newArr )


