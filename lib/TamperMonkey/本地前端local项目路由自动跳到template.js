// ==UserScript==
// @name         自动跳转 /home 到 /template
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  访问 localhost:80XX 时，弹窗询问是否跳转到 /template，选择后记住到标签页关闭
// @match        http://localhost:80*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = '__autoRedirectTemplate';
    const TARGET_HASH = '#/home';
    const REPLACE_HASH = '#/template';

    function redirectIfHome() {
        if (window.location.hash !== TARGET_HASH) return;

        const saved = sessionStorage.getItem(STORAGE_KEY);

        if (saved === null) {
            // 没选过，弹窗询问
            const answer = confirm('是否将路由从 /home 跳转到 /template ？');
            sessionStorage.setItem(STORAGE_KEY, answer ? '1' : '0');
            if (answer) {
                window.location.hash = REPLACE_HASH;
            }
        } else if (saved === '1') {
            // 之前选过"是"，直接跳转
            window.location.hash = REPLACE_HASH;
        }
        // saved === '0' → 之前选过"否"，什么都不做
    }

    redirectIfHome();
    window.addEventListener('hashchange', redirectIfHome);
    window.addEventListener('popstate', redirectIfHome);

    let lastHash = window.location.hash;
    const timer = setInterval(() => {
        if (window.location.hash !== lastHash) {
            lastHash = window.location.hash;
            redirectIfHome();
        }
    }, 200);

    window.addEventListener('load', () => {
        redirectIfHome();
        setTimeout(() => clearInterval(timer), 3000);
    });
})();