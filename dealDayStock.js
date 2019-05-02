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
  let result = await db.find('stockInfo', json2);
  if (!result || result.length === 0) {
    console.log(11223)
    let result = await db.insertOne('stockInfo', item)
    console.log("find and insert" + result)
  } else {
    console.log(33333)
    console.log(result)
    let setjson = {
      $set: {
        "ztInfo": result[0].ztInfo.concat(item.ztInfo)
      }
    };
    let result2 = await db.updateOne('stockInfo', json2, setjson)
    console.log(result2)
    console.log("find and update")
  }

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

async function getStockZt() {
  let result = await db.find('stockZt', {});
  if (!result || result.length === 0) {
      console.log(result)
      console.log("stockZt is null")
    } else {
      let eds = everyDayStocks(result)
      console.log(eds)
      console.log('nihaonihao')
      let infosize = result.length;
      for (let i = 0; i < infosize; i++) {
        let rs = await updateStockInfo(result[i], infosize, i)
      }
      console.log('finished')
      let ras = await removeAllStockZt()
      console.log(ras + 'remove finished')
      // await 
    }
}
getStockZt()
