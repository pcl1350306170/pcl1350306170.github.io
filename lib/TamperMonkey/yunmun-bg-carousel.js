// ==UserScript==
// @name         yunmun背景轮播
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为yunmun工作台页面添加全屏背景图轮播效果
// @author       pcl1350306170
// @match        https://work.yunmun.cn/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const images = [
        'https://raw.githubusercontent.com/pcl1350306170/test-data-backup/refs/heads/main/img/AI蒂法/横屏-蒂法高清-pb5y6s.png',
        'https://raw.githubusercontent.com/pcl1350306170/test-data-backup/refs/heads/main/img/AI蒂法/横屏-蒂法高清-3r23fh.png',
        'https://raw.githubusercontent.com/pcl1350306170/test-data-backup/refs/heads/main/img/AI蒂法/横屏-蒂法高清-b1w4ug.png'
    ];

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
        .el-container, .el-aside, .el-main, .el-header, .el-footer,
        .el-menu, .el-submenu, .el-card, .el-table,.el-table tr,.el-table th.el-table__cell,
        [class*="layout"], [class*="sidebar"], [class*="header"],
        [class*="footer"], [class*="nav"], [class*="menu"],
        [class*="wrapper"], [class*="container"], [class*="page"] {

            background-color: transparent !important;
        }

        /* 3. 恢复弹窗背景色 */
        .el-dialog__body {
            background-color: revert !important;
        }
        .el-overlay-dialog{
  background-color: #333333 !important;
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
