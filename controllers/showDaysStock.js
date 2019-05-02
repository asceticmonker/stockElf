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
const calStocks2 = (time, info) => {
  let size = info.length;
  let DayObj = {}
  let timeArr = []
  let newArr = [];
  let dayInfo = info[0].info;
  timeArr.push(info[0]._id)
  for (let i=0; i<dayInfo.length; i++) {
    let item  = {
      id: dayInfo[i],
      nums:1,
      name: stockDicts[dayInfo[i]],
      lianban: 1,
      arr: []
    }
    for (let j= 0; j<size;j++) {
      if (timeArr.indexOf(info[j]._id) === -1) {
        timeArr.push(info[j]._id)
      }
      if (info[j].info.indexOf(dayInfo[i]) > -1) {
        if (item.lianban ===1) {
          item.nums = item.nums*10;
        } else if (item.lianban === 2) {
          item.nums += 5;
          item.lianban = 1;
        } 
        item.arr.push("1")
        
      } else {
        if (item.lianban >= 2) {
            item.lianban =3;
          } else {
            item.lianban = 2;
          }
        item.arr.push("0")
      }
    }
    newArr.push(item);
  }
  newArr.sort(function(v1,v2){
    return v2.nums - v1.nums
  })
  console.log(newArr)
  return [dayInfo, timeArr, newArr];
}


module.exports = {
  'GET /showDaysStock': async (ctx, next) => {
    let id = ctx.query.t;
    console.log(id)
    let cxtj = {}
    if (id) {
      cxtj = {"_id":{"$lte":id}};
    }
    let result = await db.find('everyDayZt', cxtj, 0, 15, {"_id": -1});
    if (result) {
      let arr
      if (id ) {
        arr = calStocks2(id, result)
      } else {
        arr = calStocks(result);
        console.log(arr)
      }
      ctx.render('showDaysStock.html', {
        items: arr[2],
        stocks: arr[0],
        timeArr: arr[1],
        err: "查询失败",
      });
    } else {
      ctx.render('showDaysStock.html', {
        info: '查询失败',
        err: "查询失败",
      });
    }
  //   let promise = new Promise((resolve, reject) => {
  //     db.find('everyDayZt', {}, function(err, info) {
  //       // console.log(err)
  //       // console.log(info)
  //       if (!err) {
  //         if (!info || info.length === 0) {
  //           resolve([])
  //         } else {
  //           resolve(info)
  //         }
  //       } else {
  //         reject(err)
  //       }
  //     })
  //   }).then((info) => {
  //     console.log(123123123)
  //     console.log(info)
  //     let arr = calStocks(info);
  //     ctx.render('showDaysStock.html', {
  //       items: arr[2],
  //       stocks: arr[0],
  //       timeArr: arr[1],
  //       err: "查询失败",
  //     });
  //   }, (err) => {
  //     ctx.render('showDaysStock.html', {
  //       info: '查询失败',
  //       err: "查询失败",
  //     });
  //   })
  //   await promise;
  }
};