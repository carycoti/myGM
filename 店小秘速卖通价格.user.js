// ==UserScript==
// @name         店小秘速卖通价格
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  店小秘速卖通产品的价格
// @author       Kung
// @match        *://www.dianxiaomi.com/smtProduct/*
// @grant        GM_setClipboard
// @grant        GM_notification
// ==/UserScript==

const log = console.log.bind(console);

function main() {
    let this_div = document.querySelectorAll('tr td div[style="display:inline-block;"]');
    log(this_div)
}

log(window.setTimeout(function(){main();}, 0));
