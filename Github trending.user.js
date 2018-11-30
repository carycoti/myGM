// ==UserScript==
// @name         Github Trending
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  添加Trending链接到Github首页
// @author       Kung
// @match        *://github.com/*
// @grant GM_setClipboard
// @grant GM_notification
// ==/UserScript==

const log = console.log.bind(console);

function main(){
    let my_ul = document.querySelectorAll("ul.list-style-none")[0];
    let my_trending = document.createElement("li");
    let my_a = document.createElement("a");
    my_a.href = "/trending/python?since=daily";
    my_a.id = "my-trending-url";
    my_a.className = "js-selected-navigation-item HeaderNavlink px-lg-2 py-2 py-lg-0";
    my_a.textContent = "Trending";
    my_trending.appendChild(my_a);
    let my_li = my_ul.querySelectorAll("li");
    let last_li = my_li[my_li.length - 1];
    last_li.parentNode.insertBefore(my_trending, last_li.nextSibling);
}

log(window.setTimeout(function(){main();}, 1500));
