module.exports = {
  'POST /uploadStock': async (ctx, next) => {
    var email = ctx.request.body.email || '',
      password = ctx.request.body.password || '';
    console.log(JSON.stringify(ctx.request.body))

  }
};