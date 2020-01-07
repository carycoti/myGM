// ==UserScript==
// @name         只显示备件库自营
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  只显示备件库自营
// @author       Kung
// @match        https://sell.paipai.com/auction-list/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant GM_setClipboard
// @grant GM_notification
// ==/UserScript==

function main() {
  $(document).ready(function () {
    $("li.gl-item").each(function () {
      let shop = $(this).find("div.p-label");
      shop = shop.text();
      if (shop.indexOf("备件库自营") == -1) {
        $(this).hide();
      }
    })
  })
}

window.setTimeout(function () {
  main();
  $("body, button.btn-prev, button.btn-next, ul.el-pager").click(function () {
    window.setTimeout(function () {
      main();
    }, 1500);
  });
}, 1500);