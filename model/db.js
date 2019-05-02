//这个模块里面封装了所有对数据库的常用操作
var MongoClient = require('mongodb').MongoClient;
var settings = require("./setting.js");
//不管数据库什么操作，都是先连接数据库，所以我们可以把连接数据库
//封装成为内部函数
function _connectDB(callback) {
  var url = settings.dburl; //从settings文件中，都数据库地址
  //连接数据库
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function(err, db) {
      if (err) {
        reject(err, null);
      } else {
        var db2 = db.db(settings.dbname)
        resolve([err, db, db2]);
      }
    });
  })

}

//插入数据
exports.insertOne = async function(collectionName, json) {
  let [err, db, db2] = await _connectDB()
  return new Promise((resolve, reject) => {
    db2.collection(collectionName).insertOne(json, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
      db.close(); //关闭数据库
    })
  })
};
exports.insertMany = async function(collectionName, json) {
  let [err, db, db2] = await _connectDB()
  return new Promise((resolve, reject) => {
    db2.collection(collectionName).insertMany(json, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
      db.close(); //关闭数据库
    })
  })
};

//查找数据，找到所有数据。args是个对象{"pageamount":10,"page":10}
exports.find = async function(collectionName, json, skip, limit, sort) {
  skip = skip || 0;
  limit = limit || 0;
  sort = sort || {};
  let [err, db, db2] = await _connectDB()
  return new Promise((resolve, reject) => {
    var cursor = db2.collection(collectionName).find(json).sort(sort).skip(skip).limit(limit);
    cursor.toArray(function(err, doc) {
      resolve(doc);
      db.close(); //关闭数据库
    });
  })
  
};

//删除
exports.deleteMany = async function(collectionName, json, callback) {
  let [err, db, db2] = await _connectDB()
  //删除
  return new Promise((resolve, reject) => {
    db2.collection(collectionName).deleteMany(
      json,
      function(err, results) {
        if (!err) {
          resolve(results)
        } else {
          reject(err)
        }
        db.close(); //关闭数据库
      }
    );
  })
  
};

//修改
exports.updateMany = async function(collectionName, json1, json2, callback) {
  let [err, db, db2] = await _connectDB()
  db2.collection(collectionName).updateMany(
    json1,
    json2,
    function(err, results) {
      callback(err, results);
      db.close();
    });
};
exports.updateOne = async function(collectionName, json1, json2, callback) {
  let [err, db, db2] = await _connectDB()
  return new Promise((resolve, reject) => {
    db2.collection(collectionName).updateOne(
    json1,
    json2,
    function(err, results) {
      if (!err) {
        resolve(err, results);
      } else {
        reject(err)
      }
      db.close();
    });
  });
  
};

exports.getAllCount = function(collectionName, callback) {
  _connectDB(function(err, db, db2) {
    db2.collection(collectionName).count({}).then(function(count) {
      callback(count);
      db.close();
    });
  })
};