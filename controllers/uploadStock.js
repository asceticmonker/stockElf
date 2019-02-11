const db = require('../model/db')
let stockInfo = {
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
    db.insertOne('stockZt', stockInfo, function(err, info) {
      console.log(err)
      console.log(info)
    })

  }
};