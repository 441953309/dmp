const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');
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
  const types = ['b', 't', 'i', 'm']; //b: bottom, t: top, i: inline, m: mini
  const type = types.indexOf(ctx.params.type);
  if (type == -1 || !mongoose.Types.ObjectId.isValid(ctx.params.group_id)) ctx.throw(400);

  let data = fs.readFileSync(path.join(__dirname, '../file/demo_script.html'), "utf-8");

  switch (type) {
    case 0:
      data = data.replace('{demo_type_title}', '底部浮层广告位demo');
      break;
    case 1:
      data = data.replace('{demo_type_title}', '顶部浮层广告位demo');
      break;
    case 2:
      data = data.replace('{demo_type_title}', '嵌入式广告位demo');
      break;
    case 3:
      data = data.replace('{demo_type_title}', '浮标广告位demo');
      break;
  }

  ctx.body = data
    .replace('{script_host}', config.host)
    .replace('{script_type}', ctx.params.type)
    .replace('{group_group}', ctx.params.group_id);
}

export async function getCnzzHtml(ctx) {
  const cnzz_id = ctx.params.cnzz_id || '1260235570';
  const data = fs.readFileSync(path.join(__dirname, '../file/cnzz.html'), "utf-8");
  ctx.body = data.replace(/\{group_cnzz_id\}/g, cnzz_id);
}

export async function getAdScript(ctx) {
  const types = ['b', 't', 'i', 'm']; //b: bottom, t: top, i: inline, m: mini
  const type = types.indexOf(ctx.params.type);
  const group_id = ctx.params.group_id;
  if (type == -1 || !mongoose.Types.ObjectId.isValid(group_id)) ctx.throw(400);

  const adGroup = await AdGroup.findById(group_id);
  if (!adGroup || adGroup.disable) ctx.throw(400);//判断组是否存在且未禁用

  const cnzz_id = adGroup.cnzz_id || '1260235570';

  let data;
  switch (type) {
    case 0:
      if (group_id == '57d550726313fd1b05a2ccaa') {
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner2.js'), "utf-8");
      } else {
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner.js'), "utf-8");
      }
      break;
    case 1:
      data = fs.readFileSync(path.join(__dirname, '../file/script_banner_top.js'), "utf-8");
      break;
    case 2:
      if (group_id == '57e54b38371b484c3d9c5856') {
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner_inline_60.js'), "utf-8");
      } else {
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner_inline.js'), "utf-8");
      }
      break;
    case 3:
      data = fs.readFileSync(path.join(__dirname, '../file/script_banner_mini.js'), "utf-8");
      break;
    default:
      data = fs.readFileSync(path.join(__dirname, '../file/script_banner.js'), "utf-8");
      break;
  }
  ctx.body = data.replace('group_group', ctx.params.group_id).replace(/group_cnzz_id/g, cnzz_id);
}

export async function getAdGroup(ctx) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.group_id)) ctx.throw(400);//判断id是否正确
  const adGroup = await AdGroup.findById(ctx.params.group_id).populate('ads');
  if (!adGroup || adGroup.disable) ctx.throw(400);//判断组是否存在且未禁用

  const ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip.replace('::ffff:', '');
  const items = [];
  for (let ad of adGroup.ads) {
    if (!ad.disable) {
      ad.isA = adGroup.isA && ad.isA;
      ad.isS = adGroup.isS && ad.isS;
      if (ad.isA && ctx.params.group_id != '57d2329e703055a309e186ff') {//如果需要自动点击, 则判断上次自动点击的时间是否已经超过一小时
        const exists = await client.existsAsync(ad.id + ' ' + ip);
        if (exists) ad.isA = false;
      }

      const info = {};
      if (ad.isS) {  //广告显示才需要图片和点击地址
        info.img = `http://res.mobaders.com/uploads/${ad.imgName}.jpg`;
        info.img1 = `http://res.mobaders.com/uploads/${ad.imgName}_m.png`;
        info.url = `https://www.mobaders.com/j/c/${adGroup.id}/${ad.id}`;
      }
      if (ad.isA) {  //广告自动点击才需要自动点击地址
        info.url1 = `https://www.mobaders.com/j/a/${adGroup.id}/${ad.id}`;
      }

      if (ad.isS || ad.isA) items.push(info);
    }
  }
  ctx.body = {canClose: adGroup.canClose, items: items};
  ShowRecord.create({group_id: adGroup._id, ip});
}

export async function jump(ctx) {
  const types = ['s', 'c', 'a']; //s: show, c: click, a: autoclick
  const ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip.replace('::ffff:', '');

  const type = types.indexOf(ctx.params.type);
  const group_id = ctx.params.group_id;
  const ad_id = ctx.params.ad_id;
  if (type == -1) ctx.throw(400);
  if (!mongoose.Types.ObjectId.isValid(group_id))ctx.throw(400);
  if (!mongoose.Types.ObjectId.isValid(ad_id))ctx.throw(400);

  const ad = await Ad.findById(ad_id);
  if (!ad) ctx.throw(400);

  if (type === 0) { //广告图片展示统计
    ctx.redirect(`http://res.mobaders.com/uploads/${ad.imgName}.jpg`);
  } else {
    client.set(ad.id + ' ' + ip, 1, err => {
      if (err) console.log('Redis Err: ' + err.toString());
    });
    client.expire(ad.id + " " + ip, 60 * 10);

    if (type === 1) { //广告点击统计
      ctx.redirect(ad.url);
      ClickRecord.create({group_id, ad_id, ip, auto: false});
    } else if (type === 2) {//广告自动点击统计
      const ua = ctx.state.userAgent
      if (ua.isiPhone || ua.isiPad) {
        ctx.redirect(ad.url);
        // ClickRecord.create({group_id, ad_id, ip, auto: true});
      } else {
        ctx.body = ' ';
      }
    } else {
      ctx.throw(400);
    }
  }
}
