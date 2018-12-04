// ==UserScript==
// @name        豆瓣 ReadFree 传送门
// @namespace   https://github.com/JiajunW/douban2readfree
// @description 在“豆瓣读书”页面增加到ReadFree电子书的传送门
// @icon        https://raw.githubusercontent.com/JiajunW/douban2readfree/master/res/icon.png
// @include     https://book.douban.com/*
// @version     1.0.3
// @resource    custom_css https://raw.githubusercontent.com/JiajunW/douban2readfree/master/style/style.css
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @connect     readfree.me
// ==/UserScript==

const log = console.log.bind(console);

function get_book_id(url) {
    let re = /\/subject\/(\d+)/g;
    let matches = re.exec(url);
    if (matches && matches.length > 1) {
        return parseInt(matches[1]);
    }
}

function add_readfree_style() {
    GM_addStyle(GM_getResourceText("custom_css"));
}

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

function rf_book_body() {
    let path = document.location.pathname;
    let id = get_book_id(path);
    if (id) {
        let rf_url = 'http://readfree.me/book/' + id;
        GM_xmlhttpRequest({
            method: "HEAD",
            url: rf_url,
            onload: function (response) {
                if (response.status === 200) {
                    let panel = dom('div', {id: 'readfree-link'});
                    let ahref = dom('a', {href: rf_url, target: '_blank'}, 'ReadFree!');
                    panel.appendChild(ahref);
                    document.body.appendChild(panel);
                    add_readfree_style();
                }
            }
        })
    }
}

function all_book() {
    let my_a = document.querySelectorAll("a");
    for (let i = 0; i < my_a.length; i++) {
        let this_a = my_a[i];
        if (this_a.href.indexOf("subject")) {
            let id = get_book_id(this_a.href);
            if (id) {
                let rf_url = 'http://readfree.me/book/' + id;
                GM_xmlhttpRequest({
                    method: "HEAD",
                    url: rf_url,
                    onload: function (response) {
                        if (response.status === 200) {
                            let ahref = dom('button', {href: rf_url, target: '_blank'}, 'ReadFree!');
                            this_a.parentNode.insertBefore(ahref, this_a.nextSibling);
                        }
                    }
                })
            }
        }
    }
}

function main(){
    rf_book_body();
    all_book();
}

log(window.setTimeout(function(){main();}, 0));