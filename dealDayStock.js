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
  let result = await db.insertOne('everyDayZt', obj)
  return result;
}

async function updateStockInfo(item, infosize, i) {
  let json2 = {
    '_id': item["_id"]
  }
  console.log('updateStockInfo----' + item['_id'] + '-----' + infosize + '-----' + i)
  return new Promise((resolve, reject) => {
    db.find('stockInfo', json2, async function(info) {
      if (!info || info.length === 0) {
        console.log(11223)
        let result = await db.insertOne('stockInfo', item)
        resolve("find and insert" + result.result)

      } else {
        console.log(33333)
        let setjson = {
          $set: {
            "ztInfo": info[0].ztInfo.concat(item.ztInfo)
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
  db.find('stockZt', {}, async function(info) {
    console.log(info)
    if (!info || info.length === 0) {
      resolve([])
    } else {
      let eds = everyDayStocks(info)
      console.log(eds)
      console.log('nihaonihao')
      let infosize = info.length;
      for (let i = 0; i < infosize; i++) {
        let rs = await updateStockInfo(info[i], infosize, i)
      }
      console.log('finished')
      let ras = await removeAllStockZt()
      console.log(ras + 'remove finished')
      resolve(info)
      // await 
    }
  })
})