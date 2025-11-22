/*

// ==UserScript==
// @name         pdf转图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://it365.abctool.info/zh-cn/pdf-to-photo/
// @icon         https://www.google.com/s2/favicons?domain=abctool.info
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      http://192.168.3.40:80/blog/lib/TamperMonkey/dealpdf.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here... 192.168.3.40
    dealpdf()

})();


* */

function dealpdf() {
    let button = '<button type="button" style="color:#fff;background-color:#67c23a;border-color:#67c23a;border-radius:20px;padding:12px 23px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;transition:.1s;font-weight:500;font-size:17px;position: absolute;top:20vh;left: 45vw;    border: 0;" id="ID_BTNdownLoadPdf" ><span>开始执行</span></button>'

    $("body").append(button)

    $("#ID_BTNdownLoadPdf").click(function () {
       setInterval(function () {
           let num = getListItemLength()

           if(num === 20){
               $('.downloadAllBtn').click()
               $('.van-pagination__next').click()
           }
           console.log('当前数量：',num)
       },1000)
    })
}
function getListItemLength() {
    let num = $('.listItem').length
    return num
}