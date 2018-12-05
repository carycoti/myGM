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
    let re = /^\/subject\/(\d+)/g;
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

function create_ahref(url) {
    let id = get_book_id(url);
    if (id) {
    let rf_url = 'http://readfree.me/book/' + id;
    GM_xmlhttpRequest({
    method: "HEAD",
    url: rf_url,
    onload: function(response) {
        if (response.status === 200) {
            let panel = dom('div', { id : 'readfree-link' });
            let ahref = dom('a', { href : rf_url, target : '_blank' }, 'ReadFree!');
            panel.appendChild(ahref);
            add_readfree_style();
            return panel;
        }
    }
})
}
}

function rf_book_info() {
    let path = document.location.pathname;
    document.body.appendChild(create_ahref(path));
}

function all_book() {
    let my_a = document.querySelectorAll("a");
    for (let i = 0; i < my_a.length; i++) {
        let this_a = my_a[i];
        if (this_a.href.indexOf("subject")){
            let my_href = create_ahref(this_a.href);
            this_a.parentNode.insertBefore(my_href, this_a.nextSibling);
        }
    }
}
function main(){
    rf_book_info();
    all_book()
}

log(window.setTimeout(function(){main();}, 0));
