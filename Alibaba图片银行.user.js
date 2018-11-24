// ==UserScript==
// @name         Alibaba图片银行
// @namespace   www.alibaba.com
// @description Alibaba图片银行获取图片链接和名称
// @author       Kung
// @include     *://photobank.alibaba.com/*
// @version     1.2.1
// @grant GM_setClipboard
// @grant GM_notification
// ==/UserScript==

function buttonpre(){
	var ButtonPre = document.createElement('a');
	ButtonPre.id = 'ali-pre-button';
	ButtonPre.textContent = "上一页";
    var pre = document.querySelectorAll("a.prev");
    if (pre.length){
        var Pre = pre[0];
        Pre.parentNode.replaceChild(ButtonPre, Pre);
        var buttonpre = document.getElementById('ali-pre-button');
        buttonpre.addEventListener("click", () =>{
            open(location, '_self').close(); window.open(Pre.href, "_blank");}, false);
}
}

function buttonnext(){

	var Buttonnext = document.createElement('a');
	Buttonnext.id = 'ali-next-button';
	Buttonnext.textContent = "下一页";
    var next = document.querySelectorAll("a.next");
    if (next.length){
        var Next = next[0];
        Next.parentNode.replaceChild(Buttonnext, Next);
        var buttonNext = document.getElementById('ali-next-button');
        buttonNext.addEventListener("click", () =>{
             open(location, '_self').close(); window.open(Next.href, "_blank");}, false);
    }
}

function get_image(){
    var result = [];
    var alldiv = document.querySelectorAll("div.default-preview-item");
    for (var i = 0; i < alldiv.length; i++) {
        var thisElement = alldiv[i];
        var thisImg = thisElement.querySelectorAll("img");
        var thisSKU = thisElement.querySelectorAll("div.default-preview-name");
        if (thisImg.length){
            var SKU = thisSKU[0].textContent.Trim();
            var img_url = thisImg[0].src.replace("_350x350.jpg", "").replace("_350x350.png", "");
            var str = [];
                str.push(SKU);
                str.push(img_url);
            var str1 = str.join("\t");
            result.push(str1);
        }
    }
    var rst = result.join("\n");
    var this_sku = document.createElement("textarea");
    if (alldiv.length < 10){
        this_sku.rows = alldiv.length;
    } else {
        this_sku.rows = 10;
    }
    this_sku.cols = 133;
    this_sku.readOnly = true;
    this_sku.textContent = rst;
    var thisdiv = document.querySelectorAll("div.list-preview-box")[0];
    thisdiv.parentNode.insertBefore(this_sku, thisdiv.nextSibling);
    GM_setClipboard(rst);
    GM_notification("SKU & 图片链接地址已复制到剪切板中~");
}

window.setTimeout(function(){ get_image(); buttonpre(); buttonnext(); }, 1500);
