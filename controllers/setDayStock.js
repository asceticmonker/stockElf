const db = require('../model/db')
module.exports = {
  'GET /setDayStock': async (ctx, next) => {
    async function everyDayStocks(info) {
      console.log(555)
      let arr = []
      for (let i = 0; i < info.length; i++) {
        arr.push(info[i]._id);
      }
      let obj = {}
      obj["info"] = arr;
      obj['_id'] = info[0]['ztInfo'][0]['zttime'];
      await new Promise((resolve, reject) => {
        db.insertOne('everyDayZt', obj, function(err, info) {
          if (!err) {
            resolve(info)
          } else {
            reject(err)
          }
        })
      })

    }
    // async function updateStockInfo(iteminfo) {

    // }
    console.log(123)
    let promise = new Promise((resolve, reject) => {
      db.find('stockZt', {}, function(err, info) {
        console.log(info)
        if (!err) {
          if (!info || info.length === 0) {
            resolve([])
          } else {
            console.log(9090)
            everyDayStocks(info)
            resolve(info)
            // await 
          }
        } else {
          console.log(6677)
          reject(err)
        }
      })
    }).then((info) => {
      console.log(info)
      ctx.render('setDayStock.html', {
        info: "写入成功"
      });
    }, (err) => {
      ctx.render('setDayStock.html', {
        info: '写入成功'
      });
    })
    await promise;
    console.log(222)
    ctx.render('setDayStock.html', {
      title: 'setDayStock'
    });
  }
};