// ==UserScript==
// @name        参考出价
// @description zh-cn
// @namespace   http://tampermonkey.net/
// @version     4.5.1
// @match       https://sell.paipai.com/auction-detail/*
// @match       https://sell.paipai.com/auction-detail*
// @match       https://item.jd.com/*
// @require     https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_notification
// ==/UserScript==

var sdiv = $('<div>ID: <span id="itemid">0</span> | ' +
    '<button id="jbtn">复制ID</button>' +
    '<hr>原价6折: <span id="40offpirce">0</span> | ' +
    '<button id="sbtn">预约夺宝</button></br>' +
    '90天平均出价: <span id="averigeprice">0</span>  相当于<span id="a_discount">0</span>折</br> ' +
    '90天最低出价: <span id="lowestprice">0</span>  相当于<span id="l_discount">0</span>折</hr>' +
    '<hr>最近出价参考: </div>');
sdiv.css({
    'position': 'fixed',
    'top': '150px',
    'right': '10px',
    'width': '200px',
    'border': '2px solid #000',
    'z-index': '999',
    'background-color': 'rgb(221, 221, 221)',
    'padding': '5px'
});
$('body').append(sdiv);
sdiv.append('<ul id="clog"></ul>');
// var sbtn = $('<hr><button>复制Cookie</button>');
// sdiv.append(sbtn);

function get_re(re, some) {
    let matches = re.exec(some);
    if (matches && matches.length > 1) {
        return matches[1];
    }
}

function get_res(re, some) {
    let matches = re.exec(some);
    if (matches && matches.length > 1) {
        return matches;
    }
}

function get_id(url) {
    let re = /auction-detail\/(\d+)/g;
    let matches = re.exec(url);
    if (matches && matches.length > 1) {
        return matches[1];
    }
}

function get_title(title) {
    let re = /】(.+)【/g;
    let matches = re.exec(title);
    if (matches && matches.length > 1) {
        return matches[1];
    }
}

function get_use(title) {
    let re = /备件库(\d+)[成]?新/g;
    let matches = re.exec(title);
    if (matches && matches.length > 1) {
        let rst = parseInt(matches[1])
        if (rst == 95 || rst == 99) {
            return rst;
        } else {
            return rst;
        }
    } else {
        return 1;
    }
}

function get_usedId(title) {
    let url = "http://duobaozhinan.com/api/getusedinfo.json?name=" + title
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Referer': 'http://duobaozhinan.com',
            'Cookie': 'Hm_lvt_c15140d06bc2de9496f59f92d2267b42=1578020885; Hm_lpvt_c15140d06bc2de9496f59f92d2267b42=1578560624',
        },
        onload: function (response) {
            if (response.status === 200) {
                let result = response.responseText;
                let re_usedID = /"usedId":"(\d+)/;
                let usedID = get_re(re_usedID, result);
                return usedID;
            } else {
                GM_log('没有找到相关宝物')
            }
        }
    })
}

function get_by_usedid(usedID, use = 1) {
    let re_url = 'http://duobaozhinan.com/api/getbyusedid.json?usedid=' + usedID.toString() + '&quality=' + use.toString()
    GM_xmlhttpRequest({
        method: "GET",
        url: re_url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Referer': 'http://duobaozhinan.com',
            'Cookie': 'Hm_lvt_c15140d06bc2de9496f59f92d2267b42=1578020885; Hm_lpvt_c15140d06bc2de9496f59f92d2267b42=1578560624',
        },
        onload: function (response) {
            if (response.status === 200) {
                let result = response.responseText;
                return result
            } else {
                GM_log(response.responseText)
            }
        }
    })
}

function main() {
    let id = get_id(window.location.href);
    let title = get_title(document.title);
    title = title.replace(" ", "%20").replace("|", "")
    let use = get_use(document.title);
    let price = $('span.n-price .price').text();
    price = parseInt(price);
    if (window.location.host == "item.jd.com") {
        price = $("span.p-price").text().replace('￥', '');
    }
    $('#clog').empty();
    $('#itemid').text(id);
    $('#40offpirce').text(parseInt(price * 0.6));

    let url = "http://duobaozhinan.com/api/getusedinfo.json?name=" + title
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Referer': 'http://duobaozhinan.com',
            'Cookie': 'Hm_lvt_c15140d06bc2de9496f59f92d2267b42=1578020885; Hm_lpvt_c15140d06bc2de9496f59f92d2267b42=1578560624',
        },
        onload: function (response) {
            if (response.status === 200) {
                let result = response.responseText;
                let re_usedID = /"usedId":"(\d+)/;
                let usedID = get_re(re_usedID, result);
                let re_url = 'http://duobaozhinan.com/api/getbyusedid.json?usedid=' + usedID.toString() + '&quality=' + use.toString()
                GM_xmlhttpRequest({
                    method: "GET",
                    url: re_url,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        'Referer': 'http://duobaozhinan.com',
                        'Cookie': 'Hm_lvt_c15140d06bc2de9496f59f92d2267b42=1578020885; Hm_lpvt_c15140d06bc2de9496f59f92d2267b42=1578560624',
                    },
                    onload: function (response) {
                        if (response.status === 200) {
                            let total_result = response.responseText;
                            let total_list = total_result.split('"today":')[0];
                            total_list = total_list.split('{"capped');
                            let clog = "";
                            if (total_list) {
                                let total_chujia = 0;
                                let minchujia = 99999;
                                let m = 0;
                                for (let i in total_list) {
                                    if (i > 0 && i < 11 && i < total_list.length) {
                                        let re_chujia = /"endPrice":(\d+)/;
                                        let chujia = get_re(re_chujia, total_list[i]);
                                        total_chujia += parseInt(chujia);
                                        if (parseInt(chujia) < minchujia) {
                                            minchujia = parseInt(chujia)
                                        }
                                        let re_yuanjia = /Price":(\d+)/;
                                        let yuanjia = get_re(re_yuanjia, total_list[i]);
                                        let re_ftime = /"endDateTime":"([-\d :]+)/;
                                        let ftime = get_re(re_ftime, total_list[i]);
                                        clog = clog + "<li>" + i + ". 成交价:" + chujia + "元  原价: " + yuanjia + "元</br>结束时间: " + ftime + "</li>";
                                        m += 1;
                                    }
                                }
                                let average_chujia = total_chujia / m;
                                let a_discount = average_chujia / price * 10;
                                a_discount = a_discount.toFixed(1);
                                let l_discount = minchujia / price * 10;
                                l_discount = l_discount.toFixed(1);
                                $('#averigeprice').text(parseInt(average_chujia));
                                $('#lowestprice').text(minchujia);
                                $('#a_discount').text(a_discount);
                                $('#l_discount').text(l_discount);
                            }
                            $('#clog').html(clog);
                        }
                    }
                })
            } else {
                GM_log('没有找到相关宝物');
            }
        }
    })



    // let re_url = 'http://duobaozhinan.com/api/getbyusedid.json?usedid=' + usedID + '&quality=' + use
    // GM_xmlhttpRequest({
    //     method: "GET",
    //     url: re_url,
    //     headers: {
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
    //         'Accept': 'application/json, text/plain, */*',
    //         'Referer': 'http://duobaozhinan.com',
    //         'Cookie': 'Hm_lvt_c15140d06bc2de9496f59f92d2267b42=1578020885; Hm_lpvt_c15140d06bc2de9496f59f92d2267b42=1578555192',
    //     },
    //     onload: function (response) {
    //         if (response.status === 200) {
    //             let result = response.responseText;
    //             GM_log(result)
    //             // let re_averige = /平均成交价:(\d+.?\d+)/g;
    //             // let averige_price = get_re(re_averige, result);
    //             // let re_lowest = /最低成交价:(\d+)/g;
    //             // let lowest_price = get_re(re_lowest, result);
    //             // $('#averigeprice').text(averige_price);
    //             // $('#lowestprice').text(lowest_price);
    //             // // let re_tr = /<tr>([\w\W]*)<\/tr>/g
    //             // // let tr_list = re_tr.exec(result)
    //             // let mytable = $(response.response).find("#mytable tr");
    //             // let clog = "";
    //             // if (mytable.length >= 3) {
    //             //     $(mytable).each(function (i) {
    //             //         if (i > 0 && i < 6 && i < mytable.length - 1) {
    //             //             let chujia = $(this).find('td')[3].innerText;
    //             //             let yuanjia = $(this).find('td')[4].innerText;
    //             //             let ftime = $(this).find('td')[5].innerText;
    //             //             clog = clog + "<li>" + i + ". 成交价:" + chujia + "元  原价: " + yuanjia + "元</br>结束时间: " + ftime + "</li>";
    //             //             i += 1;

    //             //         }
    //             //     })
    //             // }
    //             // $('#clog').html(clog);
    //         }
    //     }
    // })

    // let data = "shopName=" + title + "&use=" + use + "&productType=1&days=90&numbers=100"
    // let rf_url = 'http://jd.svipnet.com/list.php';

    // GM_xmlhttpRequest({
    //     method: "POST",
    //     url: rf_url,
    //     headers: {
    //         'User-Agent': 'Mozilla/4.0 (compatible) Greasemonkey',
    //         'Accept': 'application/atom+xml,application/xml,text/xml',
    //         'Content-type': 'application/x-www-form-urlencoded',
    //     },
    //     data: data,
    //     onload: function (response) {
    //         if (response.status === 200) {
    //             let result = response.responseText;
    //             let re_averige = /平均成交价:(\d+.?\d+)/g;
    //             let averige_price = get_re(re_averige, result);
    //             let re_lowest = /最低成交价:(\d+)/g;
    //             let lowest_price = get_re(re_lowest, result);
    //             $('#averigeprice').text(averige_price);
    //             $('#lowestprice').text(lowest_price);
    //             // let re_tr = /<tr>([\w\W]*)<\/tr>/g
    //             // let tr_list = re_tr.exec(result)
    //             let mytable = $(response.response).find("#mytable tr");
    //             let clog = "";
    //             if (mytable.length >= 3) {
    //                 $(mytable).each(function (i) {
    //                     if (i > 0 && i < 6 && i < mytable.length - 1) {
    //                         let chujia = $(this).find('td')[3].innerText;
    //                         let yuanjia = $(this).find('td')[4].innerText;
    //                         let ftime = $(this).find('td')[5].innerText;
    //                         clog = clog + "<li>" + i + ". 成交价:" + chujia + "元  原价: " + yuanjia + "元</br>结束时间: " + ftime + "</li>";
    //                         i += 1;

    //                     }
    //                 })
    //             }
    //             $('#clog').html(clog);
    //         }
    //     }
    // })
}

window.setTimeout(function () {
    main();
}, 1500);


$('#jbtn').click(function () {
    let id = get_id(window.location.href);
    GM_setClipboard(id);
})

$("#sbtn").click(function () {
    let id = get_id(window.location.href);
    let data = "auctionId=" + id + "&entryid=p0020002app190123&p=6"
    let rf_url = 'https://used-api.paipai.com/auction/add-reminder';
    GM_xmlhttpRequest({
        method: "POST",
        url: rf_url,
        headers: {
            'User-Agent': '2.1.5;JDAPPERSHOU_IOS;Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        data: data,
        onload: function (response) {
            if (response.status === 200) {
                let result = response.responseText;
                let code = get_re(/"code":(\d+)/g, result)
                let message = get_re(/"message":"(.+)"/g, result)
                if (code != 200) {
                    GM_notification('预约失败: ' + message);
                } else {
                    GM_notification('预约成功')
                }
            }
        }
    })
})

let dragging = false;
let iX, iY;
sdiv.mousedown(function (e) {
    dragging = true;
    iX = e.clientX - this.offsetLeft;
    iY = e.clientY - this.offsetTop;
});
document.onmousemove = function (e) {
    if (dragging) {
        e = e || window.event;
        let oX = e.clientX - iX;
        let oY = e.clientY - iY;
        sdiv.css({
            'left': oX + 'px',
            'top': oY + 'px',
        });
        return false;
    }
};
$(document).mouseup(function (e) {
    dragging = false;
    e.cancelBubble = true;
});