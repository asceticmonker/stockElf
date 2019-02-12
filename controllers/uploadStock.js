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

    // 返回提交的数据 方便查看
    // ctx.render('show-info.html', stockInfo);
    db.insertOne('stockZt', stockInfo, function(err, info) {
      console.log(123)
      console.log(err)
      if (!err) {
        console.log(ctx)
        ctx.render('show-info.html', stockInfo);
        // ctx.render('simple-info.html', {
        //   info: '提交成功',
        //   url: '/collect'
        // });
      }
    })

  }
};