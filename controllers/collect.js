const moment = require('moment')
module.exports = {
  'GET /collect': async (ctx, next) => {
    let week = moment().format('d')
    let date = moment().format('YYYY-MM-DD')
    console.log(week, date)
    if (week === '0' ) {
      date = moment().weekday(-2).format('YYYY-MM-DD');
    } else if (week === '6') {
      date = moment().weekday(5).format('YYYY-MM-DD');
    }
    console.log(date)
    ctx.render('collect.html', {
      title: 'Collect Stock',
      date: date
    });
  }
};