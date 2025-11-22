/*
*
* // ==UserScript==
// @name         保存网页内容
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wiki.biligame.com/*
// @icon         https://www.google.com/s2/favicons?domain=caoni28.com
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      http://localhost:89/blog/lib/TamperMonkey/webContentSave.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
* */
$(function () {
    let URLL = window.location.href
    const PHP = 'http://localhost:28019/opex-crawler/saveWebContent'

    if(URLL.includes('arttype/112') || URLL.includes('aaa.html')){
        // 列表页

        let setVelNum = null
        // 1、更新记录数字
        // 展开所有文章
        let btn = '<button type="button" style="color:#fff;background-color:#67c23a;border-color:#67c23a;border-radius:20px;padding:12px 23px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;transition:.1s;font-weight:500;font-size:30px;position: fixed;top:5vh;left: 2vw;    border: 0;z-index:999999;" id="ID_showbtn" ><span>开始执行</span></button>'

        $("body").append(btn);


        $("#ID_showbtn").click(function () {
            $('.qr-content').find('.video-item').each(function () {
                let item = $(this)[0].onclick.toString(),
                    item2 = item.split('window.open(\''),
                    item3 = item2[1].split('\',\'_self\''),
                    a = item3[0]
                window.open(a)
            })

            // 打开分页
            setTimeout(function () {
                $(".layui-laypage-default a").each(function () {
                    let t = $(this).text()
                    if(t=='下一页'){
                        let a2= $(this).attr('href');
                        window.open(a2);
                    }
                })
                window.close();
            },1000*3)
        })

        setTimeout(function () {
            $("#ID_showbtn").click()
        },1000*5)

    }else {

        // 详情页保存文章内容
        let btn = '<button type="button" style="color:#fff;background-color:#67c23a;border-color:#67c23a;border-radius:20px;padding:12px 23px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;transition:.1s;font-weight:500;font-size:30px;position: fixed;top:5vh;left: 2vw;    border: 0;z-index:999999;" id="ID_showbtn" ><span>开始执行</span></button>'

        $("body").append(btn);

        $("#ID_savebtn").click(function () {
            let C = $("#mw-content-text").text(),
                title = document.title,
                C2 = C.split('<br>'),
                content = C2.join('\r\n')

            $.ajax({
                type: "POST",
                URLL: PHP,
                data: {
                    content,
                    title
                },
                success: function (data) {
                    window.close();
                },
                error: function (data) {

                }
            })
        })
        $("#ID_savebtn").click()
    }

})
