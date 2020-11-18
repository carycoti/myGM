// ==UserScript==
// @name         删除已过期的滴答任务
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  删除已过期的滴答任务
// @author       Kung
// @match        *.dida365.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_getResourceText
// @grant        GM_log
// ==/UserScript==


function main() {
    $(document).ready(function () {
        $("div.l-task").each(function () {
            if ($(this).find(".duedate-overdue").length > 0) {
                $(this).find(".check-toggle").click();
            }
        });
    });
}

GM_log(window.setTimeout(function () {
    main();
    $("#task-list-content").scroll(function () {
    window.setTimeout(function () {
      main();
    }, 5000);
  });
}, 5000));