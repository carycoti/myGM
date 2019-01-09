// ==UserScript==
// @name         国际站上架
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  去除没用的内容
// @author       Kung
// @match        https://post.alibaba.com/product/publish*
// @grant GM_setClipboard
// @grant GM_notification
// ==/UserScript==

const log = console.log.bind(console);

function replace_dom(replace, dom) {
    dom.parentNode.replaceChild(replace, dom);
}

function main(){
    let div = document.createElement("div");
    let salePropInfo = document.getElementById("struct-salePropInfo");
    replace_dom(div, salePropInfo);
    let productCertificateText = document.getElementById("struct-productCertificateText");
    replace_dom(div, productCertificateText);
    let certificate = document.getElementById("struct-certificate");
    replace_dom(div, certificate);
    let wholeSalePkgDesc = document.getElementById("struct-wholeSalePkgDesc");
    replace_dom(div, wholeSalePkgDesc);
    let pkgImageUpload = document.getElementById("struct-pkgImageUpload");
    replace_dom(div, pkgImageUpload);
    let detailVideo = document.getElementById("struct-detailVideo");
    replace_dom(div, detailVideo);
    let imageVideo = document.getElementById("struct-imageVideo");
    replace_dom(div, imageVideo);
    let productDescType = document.getElementById("struct-productDescType");
    replace_dom(div, productDescType);
}

function add_sku(){
    let sku_div = document.getElementById("struct-p-191284004");
    let sku = sku_div.querySelector("span input").value;
    log(sku)
}

log(window.setTimeout(function(){main(); add_sku();}, 1500));
