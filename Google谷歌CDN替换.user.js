// ==UserScript==
// @name         Google谷歌CDN替换
// @namespace    endday
// @version      0.0.1
// @description  将 Google 的 CDN 替换成国内的 CDN 地址
// @author       endday
// @license      GPL-2.0
// @update       2020/4/15
// @match        *://*/*
// @match        https://*.stackoverflow.com
// @match        https://*.stackoverflow.com/*
// @homepageURL  https://github.com/endday/tm-script
// @grant        GM_log

// @run-at       document-start

// ==/UserScript==
/* eslint-disable */

/*
!function() {
    "use strict";
    document.querySelectorAll("script").forEach((function(e) {
        if (e.src.indexOf("googleapis.com") >= 0 || e.src.indexOf("themes.googleusercontent.com") >= 0 || e.src.indexOf("www.google.com/recaptcha/") >= 0) {
            let c = e.src.replace("http://", "https://").replace("googleapis.com", "proxy.ustclug.org").replace("themes.googleusercontent.com", "google-themes.lug.ustc.edu.cn").replace("www.google.com/recaptcha/", "www.recaptcha.net/recaptcha/");
            e.parentNode.replaceChild(function(e) {
                let c = document.createElement("script");
                return c.src = e, c;
            }(c), e);
        }
    }));
}();
*/

// https://sb.sb/blog/css-cdn/

cdn = 'loli.net';
rem = 'googleapis.com';
/*
googleapisURL=document.querySelectorAll('link,script');
for (var i = 0; i < googleapisURL.length; i ++){
    if (googleapisURL[i].getAttribute('href') || googleapisURL[i].getAttribute('src')){
	if((googleapisURL[i].getAttribute('href')||googleapisURL[i].getAttribute('src')).indexOf('.googleapis.com', 'google')<0){
        if ((googleapisURL[i].getAttribute('href')||googleapisURL[i].getAttribute('src')).indexOf('map')>0){
            googleapisURL[i].parentNode.removeChild(googleapisURL[i]);
        };
	}
	else if(googleapisURL[i].getAttribute('href')){
		googleapisURL[i].setAttribute('href',googleapisURL[i].getAttribute('href').replace(rem,cdn))
	}
	else{
		googleapisURL[i].setAttribute('src',googleapisURL[i].getAttribute('src').replace(rem,cdn))
	}
}
}*/
googleapisURL=document.querySelectorAll('link,script');
for (var i = 0; i < googleapisURL.length; i ++){
    if (googleapisURL[i].getAttribute('href') || googleapisURL[i].getAttribute('src')){
        if ((googleapisURL[i].getAttribute('href')||googleapisURL[i].getAttribute('src')).indexOf('maps.google.com')>0){
            googleapisURL[i].parentNode.removeChild(googleapisURL[i]);
            GM_log('DELETE GOOGLE MAP');
        };
        if(googleapisURL[i].getAttribute('href')){
            var my_href = googleapisURL[i].getAttribute('href');
            if (my_href.indexOf('googleapis')>0||my_href.indexOf('cloudflare')>0||my_href.indexOf('gstatic')>0||my_href.indexOf('googleusercontent')>0||my_href.indexOf('gravatar')>0){
                googleapisURL[i].setAttribute('href',my_href.replace(rem, cdn));
                googleapisURL[i].setAttribute('href',my_href.replace('cdnjs.cloudflare.com','cdnjs.loli.net'));
                googleapisURL[i].setAttribute('href',my_href.replace('fonts.gstatic.com','gstatic.loli.net'));
                googleapisURL[i].setAttribute('href',my_href.replace('themes.googleusercontent.com','themes.loli.net'));
                googleapisURL[i].setAttribute('href',my_href.replace('secure.gravatar.com','gravatar.loli.net'));
            }
        }
        else{
            var my_href = googleapisURL[i].getAttribute('src');
            if (my_href.indexOf('googleapis')>0||my_href.indexOf('cloudflare')>0||my_href.indexOf('gstatic')>0||my_href.indexOf('googleusercontent')>0||my_href.indexOf('gravatar')>0){
                googleapisURL[i].setAttribute('src',my_href.replace(rem, cdn));
                googleapisURL[i].setAttribute('src',my_href.replace('cdnjs.cloudflare.com','cdnjs.loli.net'));
                googleapisURL[i].setAttribute('src',my_href.replace('fonts.gstatic.com','gstatic.loli.net'));
                googleapisURL[i].setAttribute('src',my_href.replace('themes.googleusercontent.com','themes.loli.net'));
                googleapisURL[i].setAttribute('src',my_href.replace('secure.gravatar.com','gravatar.loli.net'));
            }
        };
    }
}
