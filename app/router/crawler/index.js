const url = require('url')
const Crawler = require('crawler')


module.exports = function (ctx, next) {
  const req = ctx.request
  const data = {
    ...req.query,
    ...req.body
  }

  if (!data.url) {
    ctx.body = JSON.stringify({
      status: 'failure',
      message: '出错'
    })
    return
  }

  const oUrl = url.parse(data.url)
  if (oUrl.protocol !== 'https:' || oUrl.host !== 'mp.weixin.qq.com') {
    ctx.body = JSON.stringify({
      status: 'failure',
      message: '出错'
    })
    return
  }

  return new Promise(function (resolve, reject) {
    const crawler = new Crawler({
      maxConnections: 10,
      callback: function (error, res, done) {
        if (error) {
          ctx.body = JSON.stringify({
            status: 'failure',
            message: '出错',
            error: error
          })
          resolve(next())
        } else {
          const $ = res.$
          /*
          const $applink = $('.weapp_image_link')
          $applink.each((index, item) => {
            item = $(item)
            const img = item.find('img')
            console.log(img.data('src'))
            console.log(item.data('miniprogramAppid')) // wxb26549a375666a7a
            console.log(item.data('miniprogramPath')) // pages/item/espier-detail?id=797&utm_source=officialaccount&utm_medium=1021presale&utm_content=nail
            console.log(item.data('miniprogramType')) // image
            console.log('---------------------------------------')
          })
          */
          // 过滤
          let html = $('#js_article').html()
          html = html.replace(/<script[^>]*>[\d\D]*?<\/script>/g, '')
          html = html.replace(/<style[^>]*>[\d\D]*?<\/style>/g, '')
          html = html.replace(/<meta[^>]*>[\d\D]*?/g, '')
          html = html.replace(/<link[^>]*>[\d\D]*?/g, '')
          html = html.replace(/<title[^>]*>[\d\D]*?<\/title>/g, '')
          html = html.replace(/<!--[\w\W\r\n]*?-->/g, '')
          html = html.replace(/id="activity-name"/g, 'id="activity-name" style="padding:0 10px;"')
          html = html.replace(/id="meta_content"/g, 'id="meta_content" style="padding:0 10px 10px;"')
          html = html.trim()
          // 响应
          ctx.body = JSON.stringify({ html })
          resolve(next())
        }
        done()
      }
    })
    crawler.queue(data.url)
  })
}
