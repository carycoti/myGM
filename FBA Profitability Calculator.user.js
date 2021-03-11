// ==UserScript==
// @name        FBA利润计算器
// @description zh-cn
// @namespace   http://tampermonkey.net/
// @version     1.0.0
// @match       https://www.amazon.co.jp/*dp/*
// @match       https://www.amazon.com/*dp/*
// @match       https://www.amazon.com.au/*dp/*
// @match       https://www.amazon.co.uk/*dp/*
// @match       https://www.amazon.de/*dp/*
// @require     https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_notification
// ==/UserScript==

var sdiv = $('<div>ID: <span id="itemid">0</span> | ' +
    '<button id="jbtn">计算</button></br>' +
    '<hr>Dimensions : <span id="dimensions" style="text-align:right;"><input type="text" name="height" id="height" value=0> x <input type="text" name="width" id="width" value=0> x <input type="text" name="length" id="length" value=0></span> in. </br>' +
    'Weight : <span style="text-align:right;"><input type="text" name="weight" id="weight" value=0>lbs</span></br>' +
    'Price : <span style="text-align:right;">$ <input type="text" name="price" id="price" value=0></span></br> ' +
    'Est. Freight Cost per kilogram: <span style="text-align:right;">$ <input type="text" name="FreightCost" id="FreightCost" value=0></span></br>' +
    '<hr>FBA Fee: $ <span id="fbaFee" style="text-align:right;">0</span></br> '+
    'storageFee: $ <span id="storageFee" style="text-align:right;">0</span></br> '+
    '<hr>Net: $ <span id="net" style="text-align:right;">0</span></br> '+
    'Margin: <span id="margin" style="text-align:right;">0</span> %</br> '+
    'ROI: <span id="roi" style="text-align:right;">0</span> %</br> '+
    '</div>');
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
// sdiv.append('<ul id="clog"></ul>');
// var sbtn = $('<hr><button>复制Cookie</button>');
// sdiv.append(sbtn);

function get_asin(url) {
    let re = /\/dp\/([A-Za-z0-9]+)/g;
    let matches = re.exec(url);
    if (matches && matches.length > 1) {
        return matches[1];
    }
}

function get_rate() {
	$(document).ready(function () {
		try {
            let url = $(location).attr('href');
            let asin = get_asin(url);
            let marketplaceId = 'ATVPDKIKX0DER';
            if (url.indexOf("amazon.co.jp") != -1) {
                marketplaceId = 'A1VC38T7YXB528';
            }
            else if (url.indexOf("amazon.co.uk") != -1) {
                marketplaceId = 'A1F83G8C2ARO7P';
            }
            else if (url.indexOf("amazon.com.au") != -1) {
                marketplaceId = 'A39IBJ37TRP1C6';
            }
            else if (url.indexOf("amazon.de") != -1) {
                marketplaceId = 'A1PA6795UKMFR9';
            }
            let api_url = "https://das-server.tool4seller.cn/ap/fba/calculate?marketplaceId=" + marketplaceId + "&asin=" + asin;
            GM_xmlhttpRequest({
                method: "GET",
                url: api_url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'Cookie': '_ga=GA1.2.107451784.1605067144; _gid=GA1.2.382883749.1605067144; __root_domain_v=.tool4seller.cn; _qddaz=QD.2zmis3.ispgxl.khcvjii2; Hm_lvt_569f3a439a97ca4944bfec5572da3369=1605067145,1605068601,1605070250; Hm_lpvt_569f3a439a97ca4944bfec5572da3369=1605071825',
                },
                onload: function (response) {
                    if (response.status === 200) {
                        let result = JSON.parse(response.responseText);
                        if (result.status === 1) {
                            let item_info = result.content;
                            let amount = item_info.amount;
                            $('#price').text(amount);
                            let fbaFee = item_info.fbaFee;
                            $('#fbaFee').text(fbaFee);
                            let storageFee = item_info.storageFee;
                            $('#storageFee').text(storageFee);
                            let listFee = 0;
                            let referralFee = amount * 0.15;
                            let UnitManufacturingFee = amount * 0.2;
                            let height = item_info.height;
                            height = height * 2.54;
                            $('#height').text(height);
                            let width = item_info.width;
                            width = width * 2.54;
                            $('#width').text(width);
                            let length = item_info.length;
                            length = length * 2.54;
                            $('#length').text(length);
                            let weight = item_info.weight;
                            weight = weight * 0.4536;
                            $('#weight').text(weight);
                            let volumeWeight = height * length * width / 5000;
                            let EstFreightCost = 9;
                            $('#FreightCost').text(EstFreightCost);
                            let freightFee = 0;
                            if (volumeWeight > weight) {
                                freightFee = volumeWeight * EstFreightCost;
                            } else {
                                freightFee = weight * EstFreightCost;
                            };
                            let profit = amount - fbaFee - storageFee - listFee - referralFee - UnitManufacturingFee - freightFee;
                            $('#net').text(profit);
                            let margin_num = profit / amount * 100;
                            let margin = margin_num.toFixed(2);
                            $('#margin').text(margin);
                            let roi = profit / (UnitManufacturingFee + freightFee)
                            roi = roi.toFixed(2);
                            $('#roi').text(roi);
                        }
                    }
                }
            })
        } catch (err) {};
	});
}

function get_rate_by_click() {
    let amount = $('#price').text();
    let fbaFee = $('#fbaFee').text();
    let storageFee = $('#storageFee').text();
    let listFee = 0;
    let referralFee = amount * 0.15;
    let UnitManufacturingFee = amount * 0.2;
    let height = $('#height').text();
    let width = $('#width').text();
    let length = $('#length').text();
    let weight = $('#weight').text();
    let volumeWeight = height * length * width / 5000;
    let EstFreightCost = $('#FreightCost').text();
    let freightFee = 0;
    if (volumeWeight > weight) {
        freightFee = volumeWeight * EstFreightCost;
    } else {
        freightFee = weight * EstFreightCost;
    };
    let profit = amount - fbaFee - storageFee - listFee - referralFee - UnitManufacturingFee - freightFee;
    $('#net').text(profit);
    let margin_num = profit / amount * 100;
    let margin = margin_num.toFixed(2);
    $('#margin').text(margin);
    let roi = profit / (UnitManufacturingFee + freightFee)
    roi = roi.toFixed(2);
    $('#roi').text(roi);
}


function main() {
    get_rate();
    }

window.setTimeout(function () {
    main();
}, 1500);

$('#jbtn').click(function () {
    get_rate_by_click();
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