// ==UserScript==
// @name         yh工时背景轮播
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为yh工时工作台页面添加全屏背景图轮播效果
// @author       pcl1350306170
// @match        https://work.yunmun.cn/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const IMG_PREFIX = 'https://cdn.jsdelivr.net/gh/pcl1350306170/Miscellaneous@refs/heads/main/GPT-IMG/蒂法高清/';
    const images = [
        '横屏-蒂法高清-1l1gsl.jpg',
        '横屏-蒂法高清-1vavj6.jpg',
        '横屏-蒂法高清-2r1v0d.jpg',
        '横屏-蒂法高清-6y5lak.jpg',
        '横屏-蒂法高清-8taznv.jpg',
        '横屏-蒂法高清-bn1v07.jpg',
        '横屏-蒂法高清-k0u6ws.jpg',
        '横屏-蒂法高清-ndcfhi.jpg',
        '横屏-蒂法高清-r69u73.jpg',
        '横屏-蒂法高清-u1ut06.jpg'
    ].map(name => IMG_PREFIX + name);

    const INTERVAL = 60000; // 轮播间隔（毫秒）

    // 注入样式
    const style = document.createElement('style');
    style.textContent = `
        #tm-bg-carousel {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -9999;
            overflow: hidden;
        }
        #tm-bg-carousel .tm-bg-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            opacity: 0;
            transition: opacity 1.5s ease-in-out;
        }
        #tm-bg-carousel .tm-bg-slide.active {
            opacity: 0.5;
        }

        /* 1. 将页面使用的 CSS 变量覆盖为透明，一次解决所有引用该变量的元素 */
        :root {
            --ews-page-bg: transparent !important;
            --el-bg-color: transparent !important;
            --el-bg-color-overlay: transparent !important;
            --el-fill-color-blank: transparent !important;
            --el-mask-color: transparent !important;
        }

        /* 2. 兜底：强制所有元素的背景色透明 */
        html, body, div, section, header, footer, nav, aside, main,
        #app, .app-wrapper, .main-container, .page-container,
        .el-container, .el-aside, .el-main, .el-header, .el-footer,.el-overlay-dialog,
        .el-menu, .el-submenu, .el-card, .el-table,.el-table tr,.el-table th.el-table__cell,
        [class*="layout"], [class*="sidebar"], [class*="header"],
        [class*="footer"], [class*="nav"], [class*="menu"],
        [class*="wrapper"], [class*="container"], [class*="page"] {

            background-color: transparent !important;
        }

        /* 3. 恢复弹窗背景色 */
        .el-dialog__body ,
        .vc-container,
        .el-picker-panel__body,
        .el-select-dropdown{
            background-color: #262626 !important;
        }
        .vc-container div{
            background-color: #262626 !important;
        }
    
    `;
    document.head.appendChild(style);

    // 创建轮播容器
    const container = document.createElement('div');
    container.id = 'tm-bg-carousel';

    images.forEach((url, i) => {
        const slide = document.createElement('div');
        slide.className = 'tm-bg-slide' + (i === 0 ? ' active' : '');
        slide.style.backgroundImage = `url("${url}")`;
        container.appendChild(slide);
    });

    // 等待 DOM 就绪后插入
    function insertBg() {
        if (document.body) {
            document.body.insertBefore(container, document.body.firstChild);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.insertBefore(container, document.body.firstChild);
            });
        }
    }
    insertBg();

    // 轮播逻辑
    let currentIndex = 0;
    const slides = container.querySelectorAll('.tm-bg-slide');

    setInterval(() => {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
    }, INTERVAL);

})();
