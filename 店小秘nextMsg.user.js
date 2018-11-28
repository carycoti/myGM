// ==UserScript==
// @name         店小秘nextMsg
// @namespace    https://github.com/carycoti/myGM
// @version      1.2.0
// @description  店小秘自动勾选nextMsg：提交发送后，自动打开下一封消息
// @author       Kung
// @match        *://www.dianxiaomi.com/ebayMessage/*
// @grant        none
// ==/UserScript==

const log = console.log.bind(console);

function checked() {
    let this_input = document.getElementById('nextMsg');
    this_input.checked = "checked";
}

log(window.setTimeout(function () {checked();}, 100));
