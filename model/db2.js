//db.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stock');

let db = mongoose.connection;
// 防止Mongoose: mpromise 错误
mongoose.Promise = global.Promise;

db.on('error', function() {
  console.log('数据库连接出错！');
});
db.on('open', function() {
  console.log('数据库连接成功！');
});

//声明schema
const stockSchema = mongoose.Schema({
  stockName: String,
  stockNum: String,
  stockTime: String,
  stockfield: Array,
  ZTreason: String,
  isZT: Number,
  Zrange: Number
});
//根据schema生成model
const Stock = db.model('Stock', stockSchema)
module.exports = Stock;