const moment = require('moment')
module.exports = {
  'GET /collect': async (ctx, next) => {
    ctx.render('collect.html', {
      title: 'Collect Stock',
      date: moment().format('YYYY-MM-DD')
    });
  }
};