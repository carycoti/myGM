// ==UserScript==
// @name        Alibaba图片银行
// @namespace   https://github.com/carycoti/myGM
// @description Alibaba图片银行获取图片链接和名称
// @author      Kung
// @include     *://photobank.alibaba.com/*
// @version     1.3.6
// @grant GM_setClipboard
// @grant GM_notification
// ==/UserScript==

function buttonpre(){
	let ButtonPre = document.createElement('a');
	ButtonPre.id = 'ali-pre-button';
	ButtonPre.textContent = "上一页";
    let pre = document.querySelectorAll("a.prev");
    if (pre.length){
        let Pre = pre[0];
        Pre.parentNode.replaceChild(ButtonPre, Pre);
        let buttonpre = document.getElementById('ali-pre-button');
        buttonpre.addEventListener("click", () =>{
            open(location, '_self').close(); window.open(Pre.href, "_blank");}, false);
}
}

function buttonnext(){
	let Buttonnext = document.createElement('a');
	Buttonnext.id = 'ali-next-button';
	Buttonnext.textContent = "下一页";
    let next = document.querySelectorAll("a.next");
    if (next.length){
        let Next = next[0];
        Next.parentNode.replaceChild(Buttonnext, Next);
        let buttonNext = document.getElementById('ali-next-button');
        buttonNext.addEventListener("click", () =>{
             open(location, '_self').close(); window.open(Next.href, "_blank");}, false);
    }
}

function get_image(){
    let result = [];
    let all_div = document.querySelectorAll("div.default-preview-item");
    for (let i = 0; i < all_div.length; i++) {
        let thisElement = all_div[i];
        let thisImg = thisElement.querySelectorAll("img");
        let thisSKU = thisElement.querySelectorAll("div.default-preview-name");
        if (thisImg.length){
            let SKU = thisSKU[0].textContent.Trim();
            let img_url = thisImg[0].src.replace("_350x350.jpg", "").replace("_350x350.png", "");
            let str = [];
                str.push(SKU);
                str.push(img_url);
            let str1 = str.join("\t");
            result.push(str1);
        }
    }
    let rst = result.join("\n");
    let this_sku = document.createElement("textarea");
    if (all_div.length < 10){
        this_sku.rows = all_div.length;
    } else {
        this_sku.rows = 10;
    }
    this_sku.cols = 133;
    this_sku.readOnly = true;
    this_sku.textContent = rst;
    let thisdiv = document.querySelectorAll("div.list-preview-box")[0];
    thisdiv.parentNode.insertBefore(this_sku, thisdiv.nextSibling);
    GM_setClipboard(rst);
    GM_notification("SKU & 图片链接地址已复制到剪切板中~");
}

window.setTimeout(function(){ console.log(get_image()); console.log(buttonpre()); console.log(buttonnext()); }, 1500);
