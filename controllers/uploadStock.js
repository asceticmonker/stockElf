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
    try {
      let result = await db.insertOne('stockZt', stockInfo)
      if (result.result) {
        ctx.render('simple-info.html', {
          info: '提交成功',
          info2: JSON.stringify(result.result),
          url: '/collect'
        });
      } else {
        if (typeof result === 'object')
          result = JSON.stringify(result)
        ctx.render('simple-info.html', {
          info: '提交失败',
          info2: result,
          url: '/collect'
        });
      }
    } catch (e) {
      ctx.render('simple-info.html', {
        info: '提交失败',
        info2: e,
        url: '/collect'
      });
    }


  }
};