module.exports = {
  'GET /collect': async (ctx, next) => {
    ctx.render('collect.html', {
      title: 'Collect Stock'
    });
  }
};