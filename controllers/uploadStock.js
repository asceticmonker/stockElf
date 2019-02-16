const db = require('../model/db')
// const stock = require('../model/stock')
let stockInfo = {
  '_id': '',
  'stockName': '',
  'stockNum': '',
  'stockfield': [],
  'ztInfo': [],
  'lastEditTime': ''
}
let ztItem = {
  'zttime': '',
  'Zrange': '',
  'Ztreason': ''
}
module.exports = {
  'POST /uploadStock': async (ctx, next) => {
    for (let pattern in stockInfo) {
      stockInfo[pattern] = ctx.request.body[pattern] || '';
    }
    // console.log(ctx.request.body['stockfield'])
    stockInfo['_id'] = ctx.request.body['stockNum'] || '';
    stockInfo['stockName'] = ctx.request.body['stockName'] || '';
    stockInfo['stockNum'] = ctx.request.body['stockNum'] || '';
    stockInfo['lastEditTime'] = ctx.request.body['stockTime'] || '';
    ztItem['zttime'] = ctx.request.body['stockTime'] || '';
    ztItem['Zrange'] = ctx.request.body['Zrange'] || 'zt';
    ztItem['Ztreason'] = ctx.request.body['ZTreason'] || '';
    stockInfo['ztInfo'] = [ztItem];
    if (stockInfo['_id'] === '') {
      ctx.render('simple-info.html', {
        info: '提交失败',
        info2: "信息为空",
        url: '/collect'
      });
      return;
    }
    // let promise = new Promise((resolve, reject) => {
    //   let json2 = {
    //     "_id": stockInfo['_id']
    //   }
    //   db.find('stockZt', json2, function(err, info) {
    //     if (!err) {
    //       if (!info || info.length === 0) {
    //         db.insertOne('stockZt', stockInfo, function(err2, info2) {
    //           if (!err2) {
    //             resolve(info2)
    //           } else {
    //             reject(err2)
    //           }
    //         })
    //       } else {
    //         console.log(123)
    //         info = info[0].ztInfo;
    //         info.push(ztItem);
    //         console.log(info)
    //         let setjson = {
    //           $set: {
    //             "ztInfo": info
    //           }
    //         };

    //         db.updateOne('stockZt', json2, setjson, function(err2, info2) {
    //           if (!err2) {
    //             resolve(info2)
    //           } else {
    //             reject(err2)
    //           }
    //         })
    //       }
    //     } else {
    //       reject(err)
    //     }
    //   })
    // })
    let promise = new Promise((resolve, reject) => {
      db.insertOne('stockZt', stockInfo, function(err, info) {
        if (!err) {
          resolve(info)
        } else {
          console.log(111)
          reject(err)
        }
      })
    }).then((info2) => {
      ctx.render('simple-info.html', {
        info: '提交成功',
        info2: info2,
        url: '/collect'
      });
    }, (err) => {
      ctx.render('simple-info.html', {
        info: '提交失败',
        info2: err,
        url: '/collect'
      });
    }).catch(
      () => {
        console.log(987)
      }
    )
    await promise;


  }
};