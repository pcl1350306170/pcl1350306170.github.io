// ==UserScript==
// @name         98糖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.sehuatang.org/*
// @icon         https://www.google.com/s2/favicons?domain=caoni28.com
// @require      https://code.jquery.com/jquery-3.1.1.min.js
//
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    let URL = window.location.href
    // 获取当前页面 URL 参数
    var params = new URLSearchParams(window.location.search);
    var pageFrom = params.get('pageFrom');

    console.log(pageFrom);

    if (URL.includes('www.sehuatang.org/forum') && !URL.includes('forum.php?mod=viewthread&tid=') && !URL.includes('www.sehuatang.org/forum.php?mod=attachment&aid=')) {
        // 列表页

        let setVelNum = null
        // 1、更新记录数字
        // 展开所有文章
        let btn = '<button type="button" style="color:#fff;background-color:#67c23a;border-color:#67c23a;border-radius:20px;padding:40px 60px;font-size:100px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;transition:.1s;font-weight:500;font-size:50px;position: fixed;top:10vh;left: 5vw;    border: 0;" id="ID_showbtn" ><span>打开所有列表</span></button>' +
            '<button type="button" style="color:#fff;background-color:#2c84e8;border-color:#67c23a;border-radius:20px;padding:40px 60px;font-size:80px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;transition:.1s;font-weight:500;font-size:50px;position: fixed;top:10vh;right: 5vw;    border: 0;" id="ID_showbtn2" ><span>'+
            '打开后续X个页面-760</span></button>'

        $("body").append(btn);


        // 打开所有列表
        $("#ID_showbtn").click(function () {
            $('#threadlist tbody[id^="normalthread_"]').each(function () {
                var $a = $(this).find('th.common a.s.xst');

                if ($a.length) {
                    window.open($a.attr('href'), '_blank');
                }
            });
        })

        // 点击再打开后续X个页面
        $("#ID_showbtn2").click(function () {
            openPages(746, 14, 180);//END ==
        })

        if(pageFrom==='wode98t'){
            //alert('当是我自己打开的列表，这里点击了第一个按钮')
            $("#ID_showbtn").click()
            setTimeout(function () {
                window.close();
            }, 1000 * 60)
        }


    } else if (URL.includes('forum.php?mod=viewthread&tid=')) {
        // 详情页保存文章内容
        let btn = '<button type="button" style="color:#fff;background-color:#67c23a;border-color:#67c23a;border-radius:20px;padding:12px 23px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;transition:.1s;font-weight:500;font-size:17px;position: absolute;top:20vh;left: 5vw;    border: 0;" id="ID_savebtn" ><span>开始下载</span></button>'

        $("body").append(btn);

        $("#ID_savebtn").click(function () {
            $('#postlist a[href^="forum.php?mod=attachment&aid="]').each(function () {
                // 转成绝对路径（防止是相对地址）
                var url = $(this).prop('href');
                window.open(url, '_blank');
            });

        })
        $("#ID_savebtn").click()
        setTimeout(function () {
            window.close();
        }, 1000 * 3)
    } else if (URL.includes('www.sehuatang.org/forum.php?mod=attachment&aid=')) {
        window.close();
    } else {

    }

    function openPages(startPage, num, timeout) {
        var baseUrl = "https://www.sehuatang.org/forum.php?mod=forumdisplay&fid=139&orderby=lastpost&orderby=lastpost&filter=lastpost&pageFrom=wode98t&page=";

        for (let i = 0; i < num; i++) {
            setTimeout(function () {
                let pageNum = startPage + i;
                let url = baseUrl + pageNum;
                console.log("打开页面:", url);
                window.open(url, "_blank");
            }, i * timeout * 1000); // timeout 秒 → 毫秒
        }
    }


})();
