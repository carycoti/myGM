// ==UserScript==
// @name         Github Trending
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  添加Trending链接到Github首页
// @author       Kung
// @match        *://github.com/*
// @grant GM_setClipboard
// @grant GM_notification
// ==/UserScript==

const log = console.log.bind(console);

function create_tag(id, text, href){
    let my_ul = document.querySelectorAll("ul.list-style-none")[0];
    let my_trending = document.createElement("li");
    let my_a = document.createElement("a");
    my_a.href = href;
    my_a.id = id;
    my_a.className = "js-selected-navigation-item HeaderNavlink px-lg-2 py-2 py-lg-0";
    my_a.textContent = text;
    my_trending.appendChild(my_a);
    my_ul.appendChild(my_trending);
}

function my_trending(){
    create_tag("my-trending-url", "Trending", "/trending/python?since=daily");
}

function your_stars() {
    create_tag("your-stars-url", "Your Stars", "/carycoti?tab=stars");
}

function gist_url() {
    create_tag("my-gist-url", "Your Gist", "https://gist.github.com/carycoti");
}

function main(){
    my_trending();
    your_stars();
    gist_url();
}

log(window.setTimeout(function(){main();}, 100));
