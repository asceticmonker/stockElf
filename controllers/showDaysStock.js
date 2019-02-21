const db = require('../model/db')
const stockDicts = require('../tt')


const calStocks = (info) => {
  let obj = {}
  let total = 0;
  let timeArr = []
  let stockObj = {}
  for (let i = 0; i < info.length; i++) {
    timeArr.push(info[i]["_id"])
    stockObj[info[i]["_id"]] = info[i].info;
    for (let j = 0; j < info[i].info.length; j++) {
      if (!obj[info[i].info[j]]) {
        obj[info[i].info[j]] = true;
        total++;
      }
    }
  }
  timeArr.sort(function(v1, v2) {
    return (new Date(v1).getTime() - new Date(v2).getTime())
  })
  let stocks = Object.keys(obj);
  let newArr = []

  for (let i = 0; i < stocks.length; i++) {
    let item = {}
    item.id = stocks[i];
    item.arr = []
    item.zttotal = 0;
    item.name = stockDicts[stocks[i]];
    for (let j = 0; j < timeArr.length; j++) {
      if (stockObj[timeArr[j]].indexOf(stocks[i]) > -1) {
        item.arr.push("1")
        item.zttotal ++;
      } else {
        item.arr.push("0")
      }
    }
    newArr.push(item)
  }
  newArr.sort(function(v1,v2){
    return v2.zttotal - v1.zttotal
  })
  return [stocks, timeArr, newArr];
}


module.exports = {
  'GET /showDaysStock': async (ctx, next) => {
    let promise = new Promise((resolve, reject) => {
      db.find('everyDayZt', {}, function(err, info) {
        console.log(err)
        console.log(info)
        if (!err) {
          if (!info || info.length === 0) {
            resolve([])
          } else {
            resolve(info)
          }
        } else {
          reject(err)
        }
      })
    }).then((info) => {
      console.log(info)
      let arr = calStocks(info);
      ctx.render('showDaysStock.html', {
        items: arr[2],
        stocks: arr[0],
        timeArr: arr[1],
        err: "查询失败",
      });
    }, (err) => {
      ctx.render('showDaysStock.html', {
        info: '查询失败',
        err: "查询失败",
      });
    })
    await promise;
  }
};