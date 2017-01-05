//聚告回流
var jg = document.createElement("script");
jg.innerText = 'try{md_callback_func()}catch(e){window.parent.postMessage("modeng","*")};'
document.body.appendChild(jg);
