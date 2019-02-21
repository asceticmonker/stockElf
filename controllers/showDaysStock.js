const db = require('../model/db')



const calStocks = (info) => {
  let obj = {}
  let total = 0;
  for (let i = 0; i < info.length; i++) {
    for (let j = 0; j < info[i].info.length; j++) {
      if (!obj[info[i].info[j]]) {
        obj[info[i].info[j]] = true;
        total++;
      }
    }
  }
  return total;
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
      let totals = calStocks(info);
      ctx.render('showStock.html', {
        items: info,
        totals: totals,
        err: "查询失败",
      });
    }, (err) => {
      ctx.render('showStock.html', {
        info: '查询失败',
        err: "查询失败",
      });
    })
    await promise;
  }
};