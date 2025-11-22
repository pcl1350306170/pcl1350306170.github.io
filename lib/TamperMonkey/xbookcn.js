// ==UserScript==
// @name         blog小说内容获取
// @namespace    http://tampermonkey.net/
// @version      2025-10-13
// @description  try to take over the world!
// @author       You
// @match        https://blog.xbookcn.net/*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xbookcn.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);

    const serveApiHost = 'http://localhost:28019/',
        getAllListApi = serveApiHost+'api/v1/general-data/get-by-type?dataType=blog_nevel-ll';
    // 获取当前页面 currentUrl 参数
    var params = new URLSearchParams(window.location.search);
    var pageFrom = params.get('pageFrom'),
        page = params.get('page');



    let btn =   '<button type="button" style="color:#fff;background-color:#e6ca12;border-color:#67c23a;border-radius:20px;padding:20px 60px;font-size:100px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;transition:.1s;font-weight:500;font-size:50px;position: fixed;top:8vh;left: 2vw;    border: 0;width: 80vw;" ' +
        'id="ID_showbtn2" >' +
        '<span>保存所有链接</span></button>'


    $("body").append(btn);

    $("#ID_showbtn2").click(function () {
        savePostLinks();
    })


    // 获取并保存文章链接数据
    function savePostLinks() {
        // 获取id为main的容器
        const mainContainer = document.getElementById('main');
        if (!mainContainer) {
            console.error('未找到id为"main"的容器');
            return;
        }

        // 获取所有class为post-outer的子元素
        const postOuterElements = mainContainer.getElementsByClassName('post-outer');
        if (postOuterElements.length === 0) {
            console.log('未找到class为"post-outer"的元素');
            return;
        }
        let statusmsgbody = $(".status-msg-body").text().replace(/\s+/g, '');

        // 收集所有a标签的信息
        const linksData = [];
        for (let i = 0; i < postOuterElements.length; i++) {
            const postElement = postOuterElements[i];
            // 获取当前post-outer中的所有a标签
            const aTags = postElement.getElementsByTagName('a');

            for (let j = 0; j < aTags.length; j++) {
                const aTag = aTags[j];
                // 获取a标签的文本内容（去除前后空格）
                const linkText = aTag.textContent.trim();
                // 获取a标签的href地址（处理相对路径）
                const linkUrl = aTag.href;

                // 只收集有内容和地址的链接
                if (linkText && linkUrl) {
                    linksData.push({
                        dataType: 'blog_nevel-'+statusmsgbody||'都市',
                        dataContent: linkUrl,  // 地址作为dataContent
                        dataKey: linkText      // 文本内容作为dataKey
                    });
                }
            }
        }

        if (linksData.length === 0) {
            console.log('未找到有效的a标签数据');
            return;
        }

        // 发送POST请求保存数据
        $.ajax({
            url: 'http://localhost:28019/api/v1/general-data/batch-save',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(linksData),
            dataType: 'json',
            success: function(response) {
                console.log('提交成功，共保存', linksData.length, '条数据', response);
            },
            error: function(xhr, status, error) {
                console.error('提交失败', error);
                console.log('错误状态码：', xhr.status);
            }
        });
    }


    // 定义更换页面title的方法
    function changeTitleWithRandomNumber() {
        // 获取当前页面title
        const currentTitle = document.title;

        // 判断当前title是否为数字（纯数字字符串）
        const isNumber = /^\d+$/.test(currentTitle);

        // 仅当不是数字时，才更换为随机数字
        if (!isNumber) {
            // 生成1-1000之间的随机整数
            const randomNum = Math.floor(Math.random() * 1000) + 1;
            // 更换页面title
            document.title = randomNum.toString();
        }

        // 使用setTimeout递归调用，实现每1秒执行一次
        setTimeout(changeTitleWithRandomNumber, 1000);
    }


    // 启动方法
    changeTitleWithRandomNumber();


    // Your code here...
})();