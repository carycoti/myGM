// ==UserScript==
// @name         店小秘nextMsg
// @namespace    https://github.com/carycoti/myGM
// @version      1.2.0
// @description  店小秘自动勾选nextMsg：提交发送后，自动打开下一封消息
// @author       Kung
// @match        *://www.dianxiaomi.com/ebayMessage/*
// @grant       GM_xmlhttpRequest
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
    let this_table = document.querySelector(".tableIn");
    let customer = this_table.querySelector("tr td div a").textContent;
    let order_url = 'https://www.dianxiaomi.com/package/searchPackage.htm?pageNo=0&pageSize=100&state=shipped&shopId=-1&history=&searchType=buyerAccount&content=' + customer + '&isVoided=0&isRemoved=0&commitPlatform=success&platform=&isGreen=0&isYellow=0&isOrange=0&isRed=0&isViolet=0&isBlue=0&cornflowerBlue=0&pink=0&teal=0&turquoise=0&isSearch=0&isFree=-1&isBatch=-1&isOversea=-1&orderField=shipped_time';
    GM_xmlhttpRequest({
        method: "HEAD",
        url: order_url,
        headers:{
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
            cookie: '_ati=4589820662837; dxm_i=NzE4NTghYVQwM01UZzFPQSFhNWQzZmNiYWQ2ZTA5YzRmYzAxYWIyNWM2NmNkYTRhMA; dxm_t=MTU0MDIxMzU0MSFkRDB4TlRRd01qRXpOVFF4IWEyNDk1MDljMDk4NzY2MTYwMzFiNGQ3NTU1YmE0M2Vj; dxm_c=YWgzTVh0MUQhWXoxaGFETk5XSFF4UkEhMzliYWVkOWMwMzk1YzdlNTVmNWQzMjYxZTNiNTM3ZDE; dxm_w=OThjOThmYmE1OGM5MmQxZDU1YjM5OTgxZDk1ZTczMGIhZHowNU9HTTVPR1ppWVRVNFl6a3laREZrTlRWaU16azVPREZrT1RWbE56TXdZZyExMmRhOThhNTdhM2IzYjNkZjIyMTVlNGRmNGI0NmZlNw; dxm_s=E37unnxP8VD8gD3LzSKGvPZF2pStjgMkqZOp7VPCm1A; Hm_lvt_f8001a3f3d9bf5923f780580eb550c0b=1543734432; JSESSIONID=EE7E39B42182B9E101C607F3384681CD; rememberMe=yDD1Gb23z9V2U1a2IFuMym94XtEN3k/oVkWJ6tE2w7U4MKMu/EP6agb9K7lnQ66UKlsVpqCeUUf+aymOpSnCKnWbBbwO6FqmnQ3XjeCwcl3RbeExylZ2NcwyjfaiSOgwtULILnrdMAcgcC9NTebLI6pKBgVMlxY6BYQjh7NTNZkbLUj4NwHrBRQPVZrNi8q8Zi+/VI1Hu+ZYwRtfMvaQCtHC5xcrRCTpPCI8WTYvq6np0NWiNlvFh/v4H0LnNxJcUzWw2eozpqvDEdqEwEbHAHcOxuZEgoGem+3Ee/ohk58eFxcafRsyETTJrb7vBc9r3BeSsFMWha8Y1t9L2bX+jpKWt6oYlrOm1Wd3KXirIdo/WwZIP8jcJaiYcZKc2WOW9EBceC/r32QfHrP/+zsQe5fmSWLUxdYP+AoQMIUL87PMQEaujeE31C5GCGsIZw7SOIrOyB7OJhy3sjGdlbcbv8FOv5+xOf1tmKsB8RVbhabQnN79blThNXnmgRD3yar859lI95P3XyC8OxeH+gTFzgKWIrG4in8ok0HXUSpFDDw=; Hm_lpvt_f8001a3f3d9bf5923f780580eb550c0b=1544195148',
        },
        onload: function (response) {
            log(response.responseText)
        }
    })
}

function main() {
    checked();
    add_history_orders(;
}

log(window.setTimeout(function () {main();}, 0));
