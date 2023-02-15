// ==UserScript==
// @name        知无不言
// @description zh-cn
// @namespace   http://tampermonkey.net/
// @version     1.0.0
// @match       https://www.wearesellers.com/*
// @require     https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_notification
// ==/UserScript==

function main() {
    $("#layui-layer1").remove();
    }

window.setTimeout(function () {
    main();
}, 2000);