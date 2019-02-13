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
    let json2 = {
      'time': stockInfo['stockTime']
    }
    let promise2 = new Promise((resolve, reject) => {
      db.find('dayZt', json2, function(err, info) {
        console.log(909088)
        console.log(info)
        if (!err) {
          if (!info || info.length === 0) {
            let obj = {
              time: stockInfo['stockTime'],
              ztArr: [stockInfo['stockNum']]
            }
            db.insertOne('dayZt', obj, function(err2, info2) {
              if (!err2) {
                resolve(info2)
              } else {
                reject(err2)
              }
            })
          } else {
            info = info[0].ztArr;
            if (info.indexOf(stockInfo['stockNum']) === -1) {
              info.push(stockInfo['stockNum'])
            }
            let setjson = {
              $set: {
                "ztArr": info
              }
            };
            db.updateOne('dayZt', json2, setjson, function(err2, info2) {
              console.log(1234567)
              console.log(err2)
              console.log(info2)
              if (!err2) {
                resolve(info2)
              } else {
                reject(err2)
              }
            })
          }

        } else {
          reject(err)
        }
      })
    })
    let result = await promise;
    await promise2;
    promise.then(() => {
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