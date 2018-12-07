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

function dom(tag, attr, inner) {
    let el = document.createElement(tag);
    for (let key in attr) {
        if (attr.hasOwnProperty(key)) {
            el.setAttribute(key,attr[key]);
        }
    }
    if (inner) {
        el.innerHTML = inner;
    }
    return el;
}

function checked() {
    let this_input = document.getElementById('nextMsg');
    this_input.checked = "checked";
}

function add_history_orders() {
    let this_table = document.querySelector(".tableIn")
    let customer = this_table.querySelector("tr td div a").textContent
    log(customer)
}

function main() {
    checked()
    add_history_orders()
}

log(window.setTimeout(function () {main();}, 0));
