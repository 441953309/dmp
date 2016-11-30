const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');
const AdUrl = mongoose.model('AdUrl');
const AdGroup = mongoose.model('AdGroup');
const ShowRecord = mongoose.model('ShowRecord');
const ClickRecord = mongoose.model('ClickRecord');

const config = require('../config');

const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);

const client = redis.createClient();
client.on("error", function (error) {
  console.error(error);
});

export async function getAdDemo(ctx) {
  const types = ['b', 'i']; //b: bottom, i: inline
  const type = types.indexOf(ctx.params.type);
  if (type == -1 || !mongoose.Types.ObjectId.isValid(ctx.params.group_id)) ctx.throw(400);

  let data = fs.readFileSync(path.join(__dirname, '../file_android/demo_script.html'), "utf-8");

  switch (type) {
    case 0:
      data = data.replace('{demo_type_title}', '底部浮层广告位demo');
      break;
    case 1:
      data = data.replace('{demo_type_title}', '嵌入式广告位demo');
      break;
  }

  ctx.body = data
    .replace('{script_host}', config.host)
    .replace('{script_type}', ctx.params.type)
    .replace('{group_group}', ctx.params.group_id);
}

export async function getCnzzHtml(ctx) {
  const cnzz_id = ctx.params.cnzz_id || '1260683477';
  const data = fs.readFileSync(path.join(__dirname, '../file_android/cnzz.html'), "utf-8");
  ctx.body = data.replace(/\{group_cnzz_id\}/g, cnzz_id);
}

export async function getAdScript(ctx) {
  const types = ['b', 'i']; //b: bottom, i: inline
  const type = types.indexOf(ctx.params.type);
  const group_id = ctx.params.group_id;
  if (type == -1 || !mongoose.Types.ObjectId.isValid(group_id)) ctx.throw(400);

  const adGroup = await AdGroup.findById(group_id);
  if (!adGroup || adGroup.disable) ctx.throw(400);//判断组是否存在且未禁用

  let cnzz_id = adGroup.cnzz_id || '1260683477';

  let data;

  if(Math.random() > -1){
    if (Math.random() > 0.2) {
      data = fs.readFileSync(path.join(__dirname, '../file_android/baidu.js'), "utf-8");
    }else{
      data = fs.readFileSync(path.join(__dirname, '../file_android/lg.js'), "utf-8");
    }
    return ctx.body = data
      .replace(/\{script_host\}/g, config.host)
      .replace('{group_cnzz_id}', cnzz_id);
  }

  cnzz_id = '1260819046';//卫裤统计

  switch (type) {
    case 0:
      data = fs.readFileSync(path.join(__dirname, '../file_android/script_banner.js'), "utf-8");
      break;
    case 1:
      data = fs.readFileSync(path.join(__dirname, '../file_android/script_banner_inline.js'), "utf-8");
      break;
    default:
      data = fs.readFileSync(path.join(__dirname, '../file_android/script_banner.js'), "utf-8");
      break;
  }
  ctx.body = data
    .replace(/\{script_host\}/g, config.host)
    .replace('{group_group}', ctx.params.group_id)
    .replace('{group_cnzz_id}', cnzz_id);
}

export async function getAdGroup(ctx) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.group_id)) ctx.throw(400);//判断id是否正确
  const adGroup = await AdGroup.findById(ctx.params.group_id);
  if (!adGroup || adGroup.disable) ctx.throw(400);//判断组是否存在且未禁用

  const ads = await Ad.find({disable: false, $or: [{isAll: true}, {groups: adGroup._id}]}).sort('-weight');
  const ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip.replace('::ffff:', '');
  const items1 = [];
  const items2 = [];
  for (let ad of ads) {
    if (ad.isS) {
      const info = {};
      info.img = `http://res.mobaders.com/uploadsa/${ad.imgName}.jpg`;
      info.url = `${config.host}/an/j/c/${adGroup.id}/${ad.id}`;

      const exists = await client.existsAsync(ad.id + ' ' + ip);
      if (exists) {
        items2.push(info);
      } else {
        items1.push(info);
      }
    }
  }
  ctx.body = {canClose: adGroup.canClose, items: items1.concat(items2)};
  ShowRecord.create({group_id: adGroup._id, ip});
}

export async function jump(ctx) {
  const types = ['c', 'a']; //c: click, a: autoclick
  const ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip.replace('::ffff:', '');

  const type = types.indexOf(ctx.params.type);
  const group_id = ctx.params.group_id;
  const ad_id = ctx.params.ad_id;
  if (type == -1) ctx.throw(400);
  if (!mongoose.Types.ObjectId.isValid(group_id))ctx.throw(400);
  if (!mongoose.Types.ObjectId.isValid(ad_id))ctx.throw(400);

  let urls = await AdUrl.find({adId: ad_id, disable: false});
  if (urls.length == 0) ctx.throw(400);

  client.set(ad_id + ' ' + ip, 1, err => {
    if (err) console.log('Redis Err: ' + err.toString());
  });
  client.expire(ad_id + " " + ip, 60 * 10);

  if (type === 0) { //广告点击统计
    const arr = [];
    for (let i = 0; i < urls.length; i++) {
      if (urls[i].url) {
        for (let j = 0; j < urls[i].weight; j++) {
          arr.push(i);
        }
      }
    }
    const url = urls[arr[Math.floor(Math.random() * arr.length)]].url;
    ctx.redirect(url);
    ClickRecord.create({group_id, ad_id, ip, auto: false});
  } else if (type === 1) {//广告自动点击统计
    const arr = [];
    for (let i = 0; i < urls.length; i++) {
      for (let j = 0; j < urls[i].weight; j++) {
        arr.push(i);
      }
    }
    const url = urls[arr[Math.floor(Math.random() * arr.length)]].url;
    if (url) {
      ctx.redirect(url);
    } else {
      ctx.body = ' ';
    }
  } else {
    ctx.throw(400);
  }
}
