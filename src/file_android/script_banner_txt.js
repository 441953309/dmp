var ajax = function (conf) {
  var type = conf.type;//type参数,可选
  var url = conf.url;//url参数，必填
  var data = conf.data;//data参数可选，只有在post请求时需要
  var dataType = conf.dataType;//datatype参数可选
  var success = conf.success;//回调函数可选
  if (type == null) {//type参数可选，默认为get
    type = "get";
  }
  if (dataType == null) {//dataType参数可选，默认为text
    dataType = "text";
  }
  var xhr = new XMLHttpRequest();
  xhr.open(type, url, true);
  if (type == "GET" || type == "get") {
    xhr.send(null);
  } else if (type == "POST" || type == "post") {
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      if (dataType == "text" || dataType == "TEXT") {
        if (success != null) {//普通文本
          success(xhr.responseText);
        }
      } else if (dataType == "xml" || dataType == "XML") {
        if (success != null) {//接收xml文档
          success(xhr.responseXML);
        }
      } else if (dataType == "json" || dataType == "JSON") {
        if (success != null) {//将json字符串转换为js对象
          success(eval("(" + xhr.responseText + ")"));
        }
      }
    }
  };
};
//增加cnzz统计
var cnzz = document.createElement("iframe");
cnzz.src = "{script_host}/cnzz/{group_cnzz_id}";
cnzz.style.display = "none";
document.body.appendChild(cnzz);

var wrap = document.createElement("div");
wrap.style.cssText = "width:100%;padding:7px 15px";

var div = document.getElementById("ad_210101");
if(div){
  var divs = div.getElementsByTagName("div");
  if(divs[0]){
    divs[0].appendChild(wrap);
  }else{
    document.body.appendChild(wrap);
  }
}else{
  document.body.appendChild(wrap);
}

var slider1 = function (time, doms) {
  window.IIindex = 0;
  var es = wrap.querySelectorAll("a");

  var slider = function () {
    window.IIindex = window.IIindex % doms.length;
    for (var i = 0; i < es.length; i++) {
      es[i].style.display = "none";
    }

    if (!es[window.IIindex]) {
      wrap.innerHTML += doms[window.IIindex];
      es = wrap.querySelectorAll("a");
    }

    es[window.IIindex].style.display = "inline";
    window.IIindex++;
  }

  slider()
  setInterval(function () {
    slider()
  }, time);
};

var doms = [];
var tpl = "<a href='{url}' style='display:none; text-decoration: none; color:#000; font-size: 16px; letter-spacing: -1px; font-family: 微软雅黑;' target='_parent'>{txt}</a>";
ajax({
  type: "get",
  url: "{script_host}/an/a/{group_group}",
  dataType: "json",
  success: function (json) {
    var items = json.items;
    var canClose = json.canClose;
    for (var i = 0; i < items.length; i++) {
      if (items[i].txt && items[i].url) {
        doms.push(tpl.replace("{url}", items[i].url).replace("{txt}", items[i].txt));
      }
    }

    var time1 = 1000 * 15;

    slider1(time1, doms);
  }
});
