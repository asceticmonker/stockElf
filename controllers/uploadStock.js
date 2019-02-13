const db = require('../model/db')
let stockInfo = {
  '_id': '',
  'stockName': '',
  'stockNum': '',
  'stockTime': '',
  'stockfield': '',
  'ZTreason': '',
  'isZT': '',
  'Zrange': ''
}
module.exports = {
  'POST /uploadStock': async (ctx, next) => {
    var email = ctx.request.body.email || '',
      password = ctx.request.body.password || '';
    for (let pattern in stockInfo) {
      stockInfo[pattern] = ctx.request.body[pattern] || '';
    }
    stockInfo['_id'] = ctx.request.body['stockNum'] || '';
    let promise = new Promise((resolve, reject) => {
      db.insertOne('stockZt', stockInfo, function(err, info) {
        if (!err) {
          resolve(info)
        } else {
          reject(err)
        }
      })
    })
    let result = await promise;
    console.log(result)
    promise.then(() => {
      console.log(123123)
      ctx.render('simple-info.html', {
        info: '提交成功',
        url: '/collect'
      });
    }, () => {
      ctx.render('simple-info.html', {
        info: '提交失败',
        url: '/collect'
      });
    })

  }
};