const mount = require('koa-mount');
const router = require('koa-router')();
const ad = require('./ad.js');

router.get('/cnzz/:cnzz_id', ad.getCnzzHtml);
router.get('/d/:type/:group_id', ad.getAdDemo);   //获取广告demo
router.get('/s/:type/:group_id', ad.getAdScript); //获取广告js代码
router.get('/a/:group_id', ad.getAdGroup);        //获取广告内容
router.get('/j/:type/:group_id/:ad_id', ad.jump); //跳转链接

router.get('/', ctx => {
  ctx.body='123';
});

export default function configRoutes(app) {
  app.use(mount('/', router.routes()));
}

