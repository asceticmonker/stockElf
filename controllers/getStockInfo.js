const db = require('../model/db')
module.exports = {
  'GET /getStockInfo': async (ctx, next) => {
    let id = ctx.query.id;
    let promise = new Promise((resolve, reject) => {
      let json2 = {
        "_id": id
      }
      db.find('stockZt', json2, function(err, info) {
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
      ctx.body = {
        state: 1,
        data: info
      }
    }, (err) => {
      ctx.body = {
        state: 'error',
        info: err
      };
    })
    await promise;
  }
};