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

var slider2 = function (time, urls) {
  window.AIndex = 0;
  const num = 3;
  var request = function () {
    if (window.AIndex * num < urls.length) {
      for (var i = 0; i < num; i++) {
        if (window.AIndex * num + i < urls.length) {
          var jump = document.createElement("img");
          jump.src = urls[window.AIndex * num + i];
        }
      }
      window.AIndex++;
      setTimeout(request, time);
    }
  }
  request();
};

ajax({
  type: "get",
  url: "{script_host}/a/{group_group}",
  dataType: "json",
  success: function (json) {
    var items = json.items;
    var urls = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].url1) {
        urls.push(items[i].url1);
      }
    }

    var time2 = 1000 * 3;

    slider2(time2, urls)
  }
});

//聚告回流
var jg = document.createElement("script");
jg.innerText = 'try{md_callback_func()}catch(e){window.parent.postMessage("modeng","*")};'
document.body.appendChild(jg);
