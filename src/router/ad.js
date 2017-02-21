const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');
const AdUrl = mongoose.model('AdUrl');
const AdGroup = mongoose.model('AdGroup');
const ShowRecord = mongoose.model('ShowRecord');
const ClickRecord = mongoose.model('ClickRecord');

const UglifyJS = require('uglify-js');
const JavaScriptObfuscator = require('javascript-obfuscator');

const config = require('../config');

const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);

const client = redis.createClient();
client.on("error", function (error) {
  console.error(error);
});

const IpFind = require('../libs/17mon/ip');
IpFind.load();

export async function getAdDemoFrame(ctx) {
  const ua = ctx.state.userAgent;
  if (!ua.isiPhone && !ua.isiPad) {
    return ctx.body = '请使用iPhone查看Demo';
  }

  let data = fs.readFileSync(path.join(__dirname, '../file/demo_iframe.html'), "utf-8");

  ctx.body = data
    .replace('{script_host}', config.host)
    .replace('{script_type}', ctx.params.type)
    .replace('{group_group}', ctx.params.group_id);
}

export async function getAdDemo(ctx) {
  const ua = ctx.state.userAgent;
  if (!ua.isiPhone && !ua.isiPad) {
    return ctx.body = '请使用iPhone查看Demo';
  }

  const types = ['b', 't', 'i', 'm', 'x', 'f']; //b: bottom, t: top, i: inline, m: mini, x: txt
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
    case 4:
      data = data.replace('{demo_type_title}', '文字链广告位demo');
      break;
    case 5:
      data = data.replace('{demo_type_title}', '图文信息流广告位demo');
      break;
  }

  ctx.body = data
    .replace('{script_host}', config.host)
    .replace('{script_type}', ctx.params.type)
    .replace('{group_group}', ctx.params.group_id);
}

export async function getCnzzHtml(ctx) {
  const cnzz_id = ctx.params.cnzz_id || '1260235570';
  const data = fs.readFileSync(path.join(__dirname, '../file/cnzz1.html'), "utf-8");

  let iframe1 = '<iframe style="display: none" src="{script_host}/cnzzA/{group_cnzz_id}"></iframe>';
  let iframe2 = '<iframe style="display: none" src="{script_host}/cnzzA/{group_cnzz_id}"></iframe>';
  let iframe3 = '<iframe style="display: none" src="{script_host}/cnzzA/{group_cnzz_id}"></iframe>';
  let iframe4 = '<iframe style="display: none" src="{script_host}/cnzzA/{group_cnzz_id}"></iframe>';
  let iframe5 = '<iframe style="display: none" src="{script_host}/cnzzA/{group_cnzz_id}"></iframe>';
  let iframe6 = '<iframe style="display: none" src="{script_host}/cnzzA/{group_cnzz_id}"></iframe>';
  let iframe7 = '<iframe style="display: none" src="{script_host}/cnzzA/{group_cnzz_id}"></iframe>';
  let iframe8 = '<iframe style="display: none" src="{script_host}/cnzzA/{group_cnzz_id}"></iframe>';
  let iframe9 = '<iframe style="display: none" src="{script_host}/cnzzA/{group_cnzz_id}"></iframe>';
  let iframe10 = '<iframe style="display: none" src="{script_host}/cnzzA/{group_cnzz_id}"></iframe>';
  let iframe11 = '<iframe style="display: none" src="{script_host}/cnzzA/{group_cnzz_id}"></iframe>';

  iframe1 = iframe1.replace(/\{script_host\}/g, config.host).replace(/\{group_cnzz_id\}/g, '1260846850'); //lz
  iframe2 = iframe2.replace(/\{script_host\}/g, config.host).replace(/\{group_cnzz_id\}/g, '1260849320'); //wt
  iframe3 = iframe3.replace(/\{script_host\}/g, config.host).replace(/\{group_cnzz_id\}/g, '1260849323'); //fj //用做统计iPad
  iframe4 = iframe4.replace(/\{script_host\}/g, config.host).replace(/\{group_cnzz_id\}/g, '1260857746');
  iframe5 = iframe5.replace(/\{script_host\}/g, config.host).replace(/\{group_cnzz_id\}/g, '1260857747');
  iframe6 = iframe6.replace(/\{script_host\}/g, config.host).replace(/\{group_cnzz_id\}/g, '1260857749');
  iframe7 = iframe7.replace(/\{script_host\}/g, config.host).replace(/\{group_cnzz_id\}/g, '1260857750');
  iframe8 = iframe8.replace(/\{script_host\}/g, config.host).replace(/\{group_cnzz_id\}/g, '1260857752');
  iframe9 = iframe9.replace(/\{script_host\}/g, config.host).replace(/\{group_cnzz_id\}/g, '1260857753');
  iframe10 = iframe10.replace(/\{script_host\}/g, config.host).replace(/\{group_cnzz_id\}/g, '1260857754');
  iframe11 = iframe11.replace(/\{script_host\}/g, config.host).replace(/\{group_cnzz_id\}/g, '1260857755');

  let iframe = '';
  if (Math.random() < 0.3) {
    iframe += iframe1;   //0.3
  } else if (Math.random() < 0.3) {
    iframe += iframe2;   //0.21
  }

  if (Math.random() < 0.4) {
    iframe += iframe4;
  } else if (Math.random() < 0.3) {
    iframe += iframe5;
  } else {
    iframe += iframe6;
  }

  if (Math.random() < 0.2) {
    iframe += iframe7;
  } else if (Math.random() < 0.3) {
    iframe += iframe8;
  } else if (Math.random() < 0.3) {
    iframe += iframe9;
  } else if (Math.random() < 0.3) {
    iframe += iframe10;
  } else if (Math.random() < 0.3) {
    iframe += iframe11;
  }

  const ua = ctx.state.userAgent;
  if (ua.isiPad) {
    iframe += iframe3;   //统计iPad的量
  }

  ctx.body = data.replace(/\{group_cnzz_id\}/g, cnzz_id).replace(/\{cnzz_iframe\}/g, iframe);
}

export async function getCnzzHtmlA(ctx) {
  const cnzz_id = ctx.params.cnzz_id || '1260235570';
  const data = fs.readFileSync(path.join(__dirname, '../file/cnzz.html'), "utf-8");
  ctx.body = data.replace(/\{group_cnzz_id\}/g, cnzz_id);
}

export async function getAdHtml(ctx) {
  const ua = ctx.state.userAgent;
  if (!ua.isiPhone && !ua.isiPad) {
    return ctx.body = '请使用iPhone查看';
  }

  const types = ['b', 't', 'i', 'm', 'x', 'f']; //b: bottom, t: top, i: inline, m: mini, x: txt
  const type = types.indexOf(ctx.params.type);
  if (type == -1 || !mongoose.Types.ObjectId.isValid(ctx.params.group_id)) ctx.throw(400);

  let data = fs.readFileSync(path.join(__dirname, '../file/script.html'), "utf-8");

  ctx.body = data
    .replace('{script_host}', config.host)
    .replace('{script_type}', ctx.params.type)
    .replace('{group_group}', ctx.params.group_id);
}

export async function getAdScript(ctx) {
  const types = ['b', 't', 'i', 'm', 'x', 'f']; //b: bottom, t: top, i: inline, m: mini, x: txt, f: flow
  const type = types.indexOf(ctx.params.type);
  const group_id = ctx.params.group_id;
  if (type == -1 || !mongoose.Types.ObjectId.isValid(group_id)) ctx.throw(400);

  const ua = ctx.state.userAgent;
  if (!ua.isiPhone && !ua.isiPad) {
    if (group_id == '5858e374738b10cbc4ba6cbf') {//如果是新浪
      return ctx.redirect(`http://da1.mobaders.com/an/s/${types[type]}/5843d053b3309f107f546bf6`);//跳到58Android(da2)
    } else if (group_id == '58453594256899bc460ba242') {
      return ctx.redirect(`https://da1.mobaders.com/an/s/${types[type]}/585392547023486b58900793`);//跳到电商2
    } else {
      return ctx.body = ' ';
    }
  }

  if(config.name == 'dmp6'){
    //新浪d6服务器 50%量分到d7
    if (group_id == '5858e374738b10cbc4ba6cbf' && Math.random() > 0.5) {
      return ctx.redirect(`https://d7.mobaders.com/s/${types[type]}/5858e374738b10cbc4ba6cbf`);
    }
  }

  if (config.name == 'dmp3') {
    //优酷d3服务器60%量分到 d5
    if (group_id == '5806ed00d40a6b8cfd87075d' && Math.random() > 0.4) {
      return ctx.redirect(`http://d5.mobaders.com/s/${types[type]}/5806ed00d40a6b8cfd87075d`);
    }
  }

  if (config.name == 'dmp2') {
    //d2服务器的(优酷PAD) 直接分到d5
    if (group_id == '5805d559d40a6b8cfd870757') {
      return ctx.redirect(`http://d5.mobaders.com/s/${types[type]}/5805d559d40a6b8cfd870757`);
    }

    //d2服务器的(凤凰网) 直接分到d4
    if (group_id == '58229f7fcd7cd931817446eb') {
      return ctx.redirect(`http://d4.mobaders.com/s/${types[type]}/58229f7fcd7cd931817446eb`);
    }
  }

  if (config.name == 'dmp1') {
    //d1服务器的(太平洋) 直接分到d5
    if (group_id == '582d2a6578405d309d4a1650') {
      return ctx.redirect(`http://d5.mobaders.com/s/${types[type]}/582d2a6578405d309d4a1650`);
    }
    //d1服务器的(江苏电信) 直接分到d5
    if (group_id == '5858fe87fc178ca14183f216') {
      return ctx.redirect(`http://d5.mobaders.com/s/${types[type]}/5858fe87fc178ca14183f216`);
    }
    //d1服务器的(话语) 直接分到d5
    if (group_id == '5819813bcd7cd931817446af') {
      return ctx.redirect(`http://d5.mobaders.com/s/${types[type]}/5819813bcd7cd931817446af`);
    }
    //d1服务器的(谭军) 直接分到d5
    if (group_id == '5858b94bfc178ca14183f207') {
      return ctx.redirect(`http://d5.mobaders.com/s/${types[type]}/5858b94bfc178ca14183f207`);
    }

    //d1服务器的(天涯) 直接分到d5
    if (group_id == '58635c4256514094554beb88') {
      return ctx.redirect(`http://d5.mobaders.com/s/${types[type]}/58635c4256514094554beb88`);
    }

    //d1服务器的(天涯2) 直接分到d5
    if (group_id == '5878942a56514094554beb97') {
      return ctx.redirect(`http://d5.mobaders.com/s/${types[type]}/5878942a56514094554beb97`);
    }
  }

  const adGroup = await findAdGroup(group_id);
  if (!adGroup || adGroup.disable) ctx.throw(400);//判断组是否存在且未禁用

  const ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip.replace('::ffff:', '');
  let times = await client.getAsync('AdScript_' + ip);
  times = Number(times);

  if (adGroup.pvRatioLimit > 0 && adGroup.pvRatioLimit <= times) {
    const cache = await client.getAsync(group_id + '_script_nothing');
    if (cache) return ctx.body = cache;

    let data;
    if (group_id == '586dd822ccadacdb77711cfe' || group_id == '57fee72db3abbc286373c315') {
      data = fs.readFileSync(path.join(__dirname, '../file/script_nothing_jg.js'), "utf-8");
    } else {
      data = fs.readFileSync(path.join(__dirname, '../file/script_nothing.js'), "utf-8");
    }

    data = data.replace(/\{script_host\}/g, config.host).replace('{group_group}', ctx.params.group_id);
    data = UglifyJS.minify(data, {fromString: true}).code;
    data = JavaScriptObfuscator.obfuscate(data).getObfuscatedCode();
    client.set(group_id + '_script_nothing', data, err => {
      if (err) console.log('Redis Err: ' + err.toString());
    });
    return ctx.body = data;
  }

  client.set('AdScript_' + ip, times + 1);
  client.expire('AdScript_' + ip, 60 * 60);

  //先看redis有没有缓存
  const cache = await client.getAsync(group_id + '_' + type);
  if (cache) {
    return ctx.body = cache;
  }

  const cnzz_id = adGroup.cnzz_id || '1260235570';

  let data;
  switch (type) {
    case 0:
      if (group_id == '58097d52d40a6b8cfd870765' || group_id == '5819a597cd7cd931817446b5' || group_id == '5819a4bdcd7cd931817446b4' || group_id == '583b922378405d309d4a16b3') {
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner_bottom_60.js'), "utf-8");
      } else {
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner.js'), "utf-8");
      }
      break;
    case 1:
      data = fs.readFileSync(path.join(__dirname, '../file/script_banner_top.js'), "utf-8");
      break;
    case 2:
      if (group_id == '580ef82a38f11fd18af5e26b' || group_id == '5857a07cfc178ca14183f1ff') {
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner_inline_60.js'), "utf-8");
      } else if (group_id == '5819750acd7cd931817446ac' || group_id == '5805d5b0d40a6b8cfd87075a') {//小白全网,互众2
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner_inline2.js'), "utf-8");
      } else {
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner_inline.js'), "utf-8");
      }
      break;
    case 3:
      data = fs.readFileSync(path.join(__dirname, '../file/script_banner_mini.js'), "utf-8");
      break;
    case 4:
      if (group_id == '58412d53256899bc460ba234') {
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner_txt_hq.js'), "utf-8");
      } else if (group_id == '5833a7f678405d309d4a166f') {
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner_txt_12.js'), "utf-8");
      } else {
        data = fs.readFileSync(path.join(__dirname, '../file/script_banner_txt.js'), "utf-8");
      }
      break;
    case 5:
      data = fs.readFileSync(path.join(__dirname, '../file/script_banner_flow.js'), "utf-8");
      break;
    default:
      data = fs.readFileSync(path.join(__dirname, '../file/script_banner.js'), "utf-8");
      break;
  }

  data = data
    .replace(/\{script_host\}/g, config.host)
    .replace('{group_group}', ctx.params.group_id)
    .replace('{group_cnzz_id}', cnzz_id);
  data = UglifyJS.minify(data, {fromString: true}).code;
  data = JavaScriptObfuscator.obfuscate(data).getObfuscatedCode();

  client.set(group_id + '_' + type, data, err => {
    if (err) console.log('Redis Err: ' + err.toString());
  });

  ctx.body = data;
}

export async function delAdScript(ctx) {
  const types = ['b', 't', 'i', 'm', 'x', 'f']; //b: bottom, t: top, i: inline, m: mini, x: txt
  const type = types.indexOf(ctx.params.type);
  const group_id = ctx.params.group_id;
  if (type == -1 || !mongoose.Types.ObjectId.isValid(group_id)) ctx.throw(400);

  const result1 = await client.delAsync(group_id + '_' + type);
  const result2 = await client.delAsync(group_id + '_script_nothing');

  ctx.body = result1 + ' ' + result2;
}

export async function getAdGroup(ctx) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.group_id)) ctx.throw(400);//判断id是否正确
  const adGroup = await AdGroup.findById(ctx.params.group_id).populate('ads');
  if (!adGroup || adGroup.disable) ctx.throw(400);//判断组是否存在且未禁用

  const ads = await Ad.find({disable: false, $or: [{isAll: true}, {groups: adGroup._id}]}).sort('-weight');
  const ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip.replace('::ffff:', '');

  let isLimit = false;
  if (adGroup.cityLimit) {
    const address = IpFind.findSync(ip);
    const cities = adGroup.cityLimit.split(',');
    if (address && address[2] && cities.indexOf(address[2]) != -1) isLimit = true;
  }

  const items = [];
  for (let ad of ads) {
    if (!ad.disable) {
      ad.isA = adGroup.isA && ad.isA;
      ad.isS = adGroup.isS && ad.isS;

      if (ad.isS && adGroup.isWX) ad.isS = ad.isWX; //如果是微信渠道,则只显示支持微信的广告

      if (ad.isA && ctx.params.group_id != '57d2329e703055a309e186ff') {//如果需要自动点击, 则判断上次自动点击的时间是否已经超过一小时
        const exists = await client.existsAsync(ad.id + ' ' + ip);
        if (exists) ad.isA = false;
      }

      const info = {};
      if (ad.isS) {  //广告显示才需要图片和点击地址
        info.txt = ad.title;
        info.txt2 = ad.title2;
        info.img = `https://mobaders.oss-cn-beijing.aliyuncs.com/uploads/${ad.imgName}.jpg`;
        info.img1 = `https://mobaders.oss-cn-beijing.aliyuncs.com/uploads/${ad.imgName}_s.jpg`;
        info.url = `${config.host}/j/c/${adGroup.id}/${ad.id}`;
      }
      if (ad.isA && !isLimit) {  //广告自动点击才需要自动点击地址
        info.url1 = `${config.host}/j/a/${adGroup.id}/${ad.id}`;
      }

      if (ad.isS || ad.isA) items.push(info);
    }
  }
  ctx.body = {canClose: adGroup.canClose, items: items};
  ShowRecord.create({group_id: adGroup._id, ip});
}

export async function jump(ctx) {
  const types = ['c', 'a']; //c: click, a: autoclick
  const ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip.replace('::ffff:', '');

  const type = types.indexOf(ctx.params.type);
  const group_id = ctx.params.group_id;
  const ad_id = ctx.params.ad_id;
  if (type == -1) ctx.throw(400);
  if (!mongoose.Types.ObjectId.isValid(group_id)) ctx.throw(400);
  if (!mongoose.Types.ObjectId.isValid(ad_id)) ctx.throw(400);

  const adGroup = await findAdGroup(group_id);
  if (!adGroup) ctx.throw(400);

  let urls = await findAdUrls(ad_id);
  if (!urls) {
    let ad = await Ad.findById(ad_id);
    if(!ad) ctx.throw(400, 'jump_no_ad');
    ad = await Ad.findOne({name: ad.name, disable: false})
    urls = await findAdUrls(ad_id);
    console.log('重新查找: ' + ad.name);
  }
  if (!urls) ctx.throw(400);

  client.set(ad_id + ' ' + ip, 1, err => {
    if (err) console.log('Redis Err: ' + err.toString());
  });
  client.expire(ad_id + " " + ip, 60 * 60);

  if (type === 0) { //广告点击统计
    const arr = [];
    for (let i = 0; i < urls.length; i++) {
      if (urls[i].url) {
        for (let j = 0; j < urls[i].weight; j++) {
          arr.push(i);
        }
      }
    }
    const adUrl = urls[arr[Math.floor(Math.random() * arr.length)]];
    let url = adUrl.url;
    if (url && adUrl.param1) {
      url = url + adUrl.param1 + adGroup.weight;
    }

    ctx.redirect(url);
    ClickRecord.create({group_id, ad_id, ip, auto: false});
  } else if (type === 1) {//广告自动点击统计
    const arr = [];
    for (let i = 0; i < urls.length; i++) {
      for (let j = 0; j < urls[i].weight; j++) {
        arr.push(i);
      }
    }
    const adUrl = urls[arr[Math.floor(Math.random() * arr.length)]];
    let url = adUrl.url;
    if (url && adUrl.param1) {
      url = url + adUrl.param1 + adGroup.weight;
    }

    if (url) {
      ctx.redirect(url);
    } else {
      ctx.body = ' ';
    }
  } else {
    ctx.throw(400);
  }
}

export async function apiAdGroup(ctx) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.group_id)) ctx.throw(400);//判断id是否正确
  const adGroup = await AdGroup.findById(ctx.params.group_id);
  if (!adGroup || adGroup.disable) ctx.throw(400);//判断组是否存在且未禁用

  if (ctx.params.group_id != '5808385ed40a6b8cfd870761' && ctx.params.group_id != '57fee72db3abbc286373c315') ctx.throw(400);

  const ads = await Ad.find({disable: false, $or: [{isAll: true}, {groups: adGroup._id}]}).sort('-weight');
  const ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip.replace('::ffff:', '');

  const items = [];
  for (let i = 0; i < ads.length && i < 2; i++) {
    const ad = ads[i];
    if (ad.isS && ad.isA) {
      const info = {};
      info.img = `https://mobaders.oss-cn-beijing.aliyuncs.com/uploads/${ad.imgName}.jpg`;
      info.clkmonurl = `${config.host}/core/j/c/${adGroup.id}/${ad.id}`;
      info.impmonurl = `${config.host}/core/j/a/${adGroup.id}/${ad.id}`;

      items.push(info);
    }
  }

  ctx.body = items;
  ShowRecord.create({group_id: adGroup._id, ip});
}

export async function apiJump(ctx) {
  const types = ['c', 'a']; //c: click, a: autoclick
  const ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip.replace('::ffff:', '');

  const type = types.indexOf(ctx.params.type);
  const group_id = ctx.params.group_id;
  const ad_id = ctx.params.ad_id;
  if (type == -1) ctx.throw(400);
  if (!mongoose.Types.ObjectId.isValid(group_id)) ctx.throw(400);
  if (!mongoose.Types.ObjectId.isValid(ad_id)) ctx.throw(400);

  let urls = await AdUrl.find({adId: ad_id, disable: false});
  if (urls.length == 0) {
    let ad = await Ad.findById(ad_id);
    ad = await Ad.findOne({name: ad.name, disable: false})
    urls = await AdUrl.find({adId: ad.id, disable: false});
    console.log('API重新查找: ' + ad.name);
  }
  if (urls.length == 0) ctx.throw(400);

  let isClick = false;
  if (type === 0) { //广告点击统计
    isClick = true;
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
    //判断广告是否有效
    const adGroup = await AdGroup.findById(ctx.params.group_id);
    if (!adGroup || adGroup.disable) ctx.throw(400);//判断组是否存在且未禁用
    const ad = await Ad.findById(ad_id);
    if (!ad || ad.disable) ctx.throw(400);

    if (adGroup.isA && ad.isA) {
      const ua = ctx.state.userAgent;
      if (ua.isiPhone || ua.isiPad) {
        isClick = true;

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
        ClickRecord.create({group_id, ad_id, ip, auto: true});
      } else {
        ctx.body = ' ';
      }
    } else {
      ctx.body = ' ';
    }
  } else {
    ctx.throw(400);
  }

  if (isClick) {
    client.set(ad_id + ' ' + ip, 1, err => {
      if (err) console.log('Redis Err: ' + err.toString());
    });
    client.expire(ad_id + " " + ip, 60 * 10);
  }

}

async function findAdGroup(group_id){
  if(!mongoose.Types.ObjectId.isValid(group_id)) return;

  const cache = await client.getAsync('adGroup_' + group_id);
  if (cache) return JSON.parse(cache);

  const adGroup = await AdGroup.findById(group_id);
  if(!adGroup) return;

  client.set('adGroup_' + adGroup.id, JSON.stringify(adGroup));
  client.expire('adGroup_' + adGroup.id, 60 * 10);

  return adGroup;
}

async function findAdUrls(ad_id){
  if(!mongoose.Types.ObjectId.isValid(ad_id)) return;

  const cache = await client.getAsync('adUrls_' + ad_id);
  if (cache) return JSON.parse(cache);

  console.log('查询一下');
  const urls = await AdUrl.find({adId: ad_id, disable: false});
  if(urls.length == 0) return;

  client.set('adUrls_' + ad_id, JSON.stringify(urls));
  client.expire('adUrls_' + ad_id, 60 * 10);

  return urls;
}