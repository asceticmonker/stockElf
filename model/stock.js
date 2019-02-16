const Stock = require('./db.js');
//下面这两个包用来生成时间
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

//数据库的操作
//根据gp名查找gp
const findStock = (stockName) => {
  return new Promise((resolve, reject) => {
    Stock.findOne({
      stockName
    }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
const findStock2 = (stockNum) => {
  return new Promise((resolve, reject) => {
    Stock.findOne({
      stockNum
    }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
//找到所有用户
const findAllStocks = () => {
  return new Promise((resolve, reject) => {
    Stock.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
const addStock = (stock) => {
  return new Promise((resolve, reject) => {
    stock.save((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  })
}
//删除某个用户
const delStock = function(id) {
  return new Promise((resolve, reject) => {
    Stock.findOneAndRemove({
      _id: id
    }, err => {
      if (err) {
        reject(err);
      }
      console.log('删除用户成功');
      resolve();
    });
  });
};
//登录
const Login = async (ctx) => {
  //拿到账号和密码
  let stockname = ctx.request.body.name;
  let doc = await findStock(stockname);
  if (!doc) {
    console.log('检查到用户名不存在');
    ctx.status = 200;
    ctx.body = {
      info: false
    }
  } else if (doc.password === password) {
    console.log('密码一致!');

    doc.token = token;
    await new Promise((resolve, reject) => {
      doc.save((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    ctx.status = 200;
    ctx.body = {
      success: true,
      stockname,
      token, //登录成功要创建一个新的token,应该存入数据库
      create_time: doc.create_time
    };
  } else {
    console.log('密码错误!');
    ctx.status = 200;
    ctx.body = {
      success: false
    };
  }
};
//注册
const insertStock = async (ctx) => {
  let stock = new Stock({
    stockName: ctx.request.body.stockName,
    stockNum: ctx.request.body.stockNum,
    stockTime: ctx.request.body.stockTime,
    stockfield: ctx.request.body.stockfield,
    ZTreason: ctx.request.body.ZTreason,
    isZT: ctx.request.body.isZT,
    Zrange: ctx.request.body.Zrange
  });
  //将objectid转换为用户创建时间(可以不用)
  stock.create_time = moment(objectIdToTimestamp(stock._id)).format('YYYY-MM-DD HH:mm:ss');

  let doc = await findStock(stock.stockname);
  if (doc) {

  } else {
    await addStock(stock);
    ctx.render('simple-info.html', {
      info: '提交成功',
      url: '/collect'
    });
  }
};
//获得所有用户信息
const GetAllStocks = async (ctx) => {
  //查询所有用户信息
  let doc = await findAllStocks();
};

//删除某个用户
const DelStock = async (ctx) => {
  //拿到要删除的用户id
  let id = ctx.request.body.id;
  await delStock(id);
};

module.exports = {
  insertStock: insertStock
};