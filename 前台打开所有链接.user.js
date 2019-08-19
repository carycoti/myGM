// ==UserScript==
// @name         前台打开所有链接
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  前台打开所有链接
// @author       Kung
// @match        https://gsp.aliexpress.com/*
// @match        *.dianxiaomi.com/*
// @match        *.bilibili.com/*
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_getResourceText
// @grant GM_log
// ==/UserScript==

function main() {
    $(document).ready(function () {
        $("a[href]").attr({
            "href": function (i, origValue) {
                return origValue
            },
            "target": "_self",
            "class": function (i, origValue) {
                if (origValue) {
                    return origValue + " open_in_the_current_tab"
                }
                {
                    return "open_in_the_current_tab"
                }
            }
        });
    });
}

window.setTimeout(function () {
    main();
}, 1500);