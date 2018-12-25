// ==UserScript==
// @name         国际站上架
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  去除没用的内容
// @author       Kung
// @match        https://post.alibaba.com/product/publish*
// @grant GM_setClipboard
// @grant GM_notification
// ==/UserScript==

const log = console.log.bind(console);

function main(){
    let detailVideo = document.getElementById("struct-detailVideo");
    let imageVideo = document.getElementById("struct-imageVideo");
    let div = document.createElement("div");
    imageVideo.parentNode.replaceChild(div, imageVideo);
    detailVideo.parentNode.replaceChild(div, detailVideo);
}

log(window.setTimeout(function(){main();}, 1500));
