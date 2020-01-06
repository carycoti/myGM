// ==UserScript==
// @name        参考出价
// @description zh-cn
// @namespace   http://tampermonkey.net/
// @version     2.0.0
// @match       https://sell.paipai.com/auction-detail/*
// @require     https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// ==/UserScript==

var sdiv = $('<div>ID: <span id="itemid">0</span>' +
    '<hr>原价6折: <span id="40offpirce">0</span> </br>' +
    '90天平均出价: <span id="averigeprice">0</span> </br> ' +
    '90天最低出价: <span id="lowestprice">0</span> </hr>' +
    '<hr>最近出价参考: </div>');
sdiv.css({
    'position': 'fixed',
    'top': '25px',
    'right': '10px',
    'width': '200px',
    'border': '2px solid #000',
    'z-index': '999',
    'background-color': 'rgb(221, 221, 221)',
    'padding': '5px'
});
$('body').append(sdiv);
sdiv.append('<hr><ul id="iclog"></ul>');

function get_something(re, some) {
    let matches = re.exec(some);
    if (matches && matches.length > 1) {
        return matches[1];
    }
}

function get_id(url) {
    let re = /auction-detail\/(\d+)/g
    let matches = re.exec(url);
    if (matches && matches.length > 1) {
        return matches[1];
    }
}

function get_title(title) {
    let re = /】(.+)【/g
    let matches = re.exec(title);
    if (matches && matches.length > 1) {
        return matches[1];
    }
}

function get_use(title) {
    let re = /备件库(\d+)[成]?新/g
    let matches = re.exec(title);
    if (matches && matches.length > 1) {
        let rst = parseInt(matches[1])
        if (rst == 95 || rst == 99) {
            return rst;
        } else {
            return rst * 10;
        }
    }
}


function main() {
    let id = get_id(window.location.href)
    let title = get_title(document.title);
    let use = get_use(document.title);
    let price = $('span.n-price .price').text();
    price = parseInt(price)
    $('#clog').empty();
    $('#itemid').text(id);
    $('#40offpirce').text(parseInt(price * 0.6));
    let data = "shopName=" + title + "&use=" + use + "&productType=1&days=90&numbers=100"
    let rf_url = 'http://jd.svipnet.com/list.php';
    
    GM_xmlhttpRequest({
        method: "POST",
        url: rf_url,
        headers: {
            'User-Agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: data,
        onload: function (response) {
            if (response.status === 200) {
                let result = response.responseText;
                let re_averige = /平均成交价:(\d+.?\d+)/g;
                let averige_price = get_something(re_averige, result);
                let re_lowest = /最低成交价:(\d+)/g;
                let lowest_price = get_something(re_lowest, result);
                $('#averigeprice').text(averige_price);
                $('#lowestprice').text(lowest_price);
                // let re_tr = /<tr>([\w\W]*)<\/tr>/g
                // let tr_list = re_tr.exec(result)
                let mytable = $(response.response).find("#mytable tr");
                let iclog = "";
                if (mytable.length >= 7) {
                    $(mytable).each(function (i) {
                        if (i > 0 && i < 6) {
                            let chujia = $(this).find('td')[3].innerText;
                            let yuanjia = $(this).find('td')[4].innerText;
                            let ftime = $(this).find('td')[5].innerText;
                            iclog = iclog + "<li>" + i + ". 成交价:" + chujia + "元  原价: " + yuanjia + "元</br>结束时间: " + ftime + "</li>"
                            i += 1;
                            
                        }
                    })
                }
                $('#iclog').html(iclog);
            }
        }
    })
}

window.setTimeout(function () {
    main();
}, 1500);

// jbtn.click(function () {
//     $('#clog').empty();
//     $.post('http://jd.svipnet.com/list.php', {
//         'shopName': title,
//         'productType': '1',
//         'days': '90',
//         'numbers': '100',
//         'use': use
//     }, function (data) {
//         GM_log(data);
//         $('#auction3dangqianjia').html('<em class="font12">¥</em>' + data.currentPrice);
//         $('#clog').append('<li>价格最后更新时间：' + new Date().toLocaleTimeString() + '</li>');
//     });
// });

var dragging = false;
var iX, iY;
sdiv.mousedown(function (e) {
    dragging = true;
    iX = e.clientX - this.offsetLeft;
    iY = e.clientY - this.offsetTop;
});
document.onmousemove = function (e) {
    if (dragging) {
        var e = e || window.event;
        var oX = e.clientX - iX;
        var oY = e.clientY - iY;
        sdiv.css({
            'left': oX + 'px',
            'top': oY + 'px'
        });
        return false;
    }
};
$(document).mouseup(function (e) {
    dragging = false;
    e.cancelBubble = true;
});