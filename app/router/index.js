const Router = require('koa-router')
const router = new Router()

module.exports = function (app) {
  router.get('/crawler', require('./crawler/index.js'))

  app.use(router.routes()).use(router.allowedMethods())
}
