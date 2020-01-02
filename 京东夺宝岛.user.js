// ==UserScript==
// @name         京东夺宝岛只显示备件库自营
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  京东夺宝岛只显示备件库自营
// @author       Kung
// @match        https://sell.paipai.com/auction-list/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant GM_setClipboard
// @grant GM_notification
// @grant        GM_log
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

log(window.setTimeout(function () {
  // main();
  // $("button.btn-prev, button.btn-next, ul.el-pager").click(function () {
  //   main();
  // })
  $(document).click(function () {
    main();
  })
}, 1500));