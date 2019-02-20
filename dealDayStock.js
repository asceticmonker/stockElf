const db = require('./model/db')

async function everyDayStocks(info) {
  console.log("everyDayStocks")
  let arr = []
  for (let i = 0; i < info.length; i++) {
    arr.push(info[i]._id);
  }
  let obj = {}
  obj["info"] = arr;
  obj['_id'] = info[0]['ztInfo'][0]['zttime'];
  return new Promise((resolve, reject) => {
    db.insertOne('everyDayZt', obj, function(err, info) {
      if (!err) {
        resolve("everyDayStocks --------end")
      } else {
        reject(err)
      }
    })
  })
}

async function updateStockInfo(item) {
  let json2 = {
    '_id': item["_id"]
  }
  console.log('updateStockInfo----' + item['_id'] + '-----')
  return new Promise((resolve, reject) => {
    db.find('stockInfo', json2, async function(err, info) {
      if (!err) {
        if (!info || info.length === 0) {
          let insert = await new Promise((resolve, reject) => {
            db.insertOne('stockInfo', item, function(err2, info2) {
              if (!err2) {
                resolve("updateStockInfo --------end---insert")
              } else {
                reject("updateStockInfo   error---insert" + err2)
              }
            })
          })
          resolve("find and insert" + insert)

        } else {
          let setjson = {
            $set: {
              "ztInfo": item.ztInfo,
              "lastEditTime": item.lastEditTime
            }
          };
          let update = await new Promise((resolve, reject) => {
            db.updateOne('stockInfo', json2, setjson, function(err2, info2) {
              if (!err2) {
                resolve("updateStockInfo --------end---update")
              } else {
                reject("updateStockInfo   error---update" + err2)
              }
            })
          })
          resolve("find and update" + update)
        }
      } else {
        reject("updateStockInfo  find error" + err)
      }
    })
  })
  console.log(usi)

}

function removeAllStockZt() {
  return new Promise((resolve, reject) => {
    db.deleteMany('stockZt', {}, function(err, info) {
      if (!err) {
        resolve("removeAllStockZt------success!!!!!!")
      } else {
        reject("removeAllStockZt------error!!!!!!")
      }
    })
  })
}

let promise = new Promise((resolve, reject) => {
  db.find('stockZt', {}, async function(err, info) {
    console.log(info)
    if (!err) {
      if (!info || info.length === 0) {
        resolve([])
      } else {
        console.log(9090)
        let eds = await everyDayStocks(info)
        console.log(eds)
        for (let i = 0; i < info.length; i++) {
          let rs = await updateStockInfo(info[i])
          console.log(rs)
        }
        console.log('finished')
        let ras = await removeAllStockZt()
        console.log(ras + 'remove finished')
        resolve(info)
        // await 
      }
    } else {
      console.log(6677)
      reject(err)
    }
  })
})