const Koa = require('koa')
const koaStatic = require('koa-static')
const koaBody = require('koa-body')

const index = new Koa()

require('./app/router/index.js')(index)

index
  .use(koaBody({ multipart: true }))
  .use(koaStatic('./static'))
  .listen(3000)
