const db = require('../model/db')
module.exports = {
  'GET /showStock': async (ctx, next) => {
    let promise = new Promise((resolve, reject) => {
      db.find('stockZt', {}, function(err, info) {
        // console.log(err)
        // console.log(info)
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
      ctx.render('showStock.html', {
        items: info,
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