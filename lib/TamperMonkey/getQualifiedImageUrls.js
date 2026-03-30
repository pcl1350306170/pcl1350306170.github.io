// ==UserScript==
// @name         v33爬取桀桀桀
// @namespace    http://tampermonkey.net/
// @version      2025-09-10
// @description  try to take over the world!
// @author       You
// @match        https://10012.c604c6n.cc:2096/pw/*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=d58gx9.cc
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    $(document).ready(() => {
        new PageCrawler();
    });

    class PageCrawler {
        constructor() {
            // 1. 基础配置初始化
            this.currentUrl = window.location.href;
            this.urlObj = new URL(this.currentUrl);
            this.serveApi = 'http://localhost:28019/crawl-api/v1/webCrawlData/add';
            this.serveApiHost = 'http://localhost:28019/';

            // 2. URL参数解析
            this.params = new URLSearchParams(window.location.search);
            this.pageFrom = this.params.get('pageFrom');
            this.page = this.params.get('page');

            // 3. 【核心】过滤关键词数组：包含数组中内容的a标签文本将不保存（可扩展）
            this.filterKeywords =['回家指南 &最新网址发布', '朕的江山美人', '全国高端外围私人定制', '使用谷歌浏览器可能无法正常浏览'];

            // 4. 初始化页面功能
            this.init();
        }

        /**
         * 初始化入口：根据当前URL路径加载对应页面功能
         */
        init() {
            if (this.currentUrl.includes('/pw/thread-htm')||this.currentUrl.includes('/pw/thread111')) {
                this.initThreadPage(); // 列表页初始化
            } else if (this.currentUrl.includes('/pw/html_data')) {
                this.initDetailPage(); // 详情页初始化
            }
        }

        /**
         * 列表页（thread页面）初始化：添加按钮、绑定事件
         */
        initThreadPage() {
            this.addThreadButtons();
            this.bindThreadEvents();
            this.autoExecuteIfNeeded();
        }

        /**
         * 详情页（read页面）初始化：添加按钮、绑定事件
         */
        initDetailPage() {
            this.addDetailButton();
            this.bindDetailEvents();
            this.autoExecuteDetailIfNeeded();
        }

        /**
         * 列表页添加功能按钮（打开列表、保存链接）
         */
        addThreadButtons() {
            const threadButtons = `
            <button type="button" style="color:#fff;background-color:#67c23a;border-color:#67c23a;border-radius:20px;padding:20px 60px;font-size:100px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;transition:.1s;font-weight:500;font-size:50px;position: fixed;top:15vh;left: 5vw;border: 0;" id="ID_showbtn">
                <span>打开所有列表</span>
            </button>
            <button type="button" style="color:#fff;background-color:#e6ca12;border-color:#67c23a;border-radius:20px;padding:20px 60px;font-size:100px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;transition:.1s;font-weight:500;font-size:50px;position: fixed;top:28vh;left: 5vw;border: 0;" id="ID_showbtn2">
                <span>保存所有链接</span>
            </button>
        `;
            $("body").append(threadButtons);
        }

        /**
         * 列表页按钮事件绑定
         */
        bindThreadEvents() {
            $("#ID_showbtn").click(() => this.openList(1)); // 1=打开链接
            $("#ID_showbtn2").click(() => this.openList(2)); // 2=保存链接
        }

        /**
         * 列表页自动执行：根据pageFrom参数触发对应按钮点击
         */
        autoExecuteIfNeeded() {
            if (this.pageFrom === 'wode') {
                $("#ID_showbtn").click();
            } else if (this.pageFrom === 'novels') {
                $("#ID_showbtn2").click();
            }
        }

        /**
         * 详情页添加功能按钮（保存图片）
         */
        addDetailButton() {
            const detailButton = `
            <button type="button" style="color:#fff;background-color:#67c23a;border-color:#67c23a;border-radius:20px;padding:12px 23px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;transition:.1s;font-weight:500;font-size:17px;position: absolute;top:20vh;left: 5vw;border: 0;" id="ID_savebtn">
                <span>开始执行</span>
            </button>
        `;
            $("body").append(detailButton);
        }

        /**
         * 详情页按钮事件绑定
         */
        bindDetailEvents() {
            $("#ID_savebtn").click(() => this.saveImgs());
        }

        /**
         * 详情页自动执行：根据pageFrom参数触发按钮点击
         */
        autoExecuteDetailIfNeeded() {
            if (this.pageFrom === 'image') {
                $("#ID_savebtn").click();
            }
        }

        /**
         * 【过滤核心】判断a标签文本是否包含过滤关键词
         * @param {string} text - a标签文本内容
         * @returns {boolean} true=需要过滤（不保存），false=保留（可保存）
         */
        isFiltered(text) {
            return this.filterKeywords.some(keyword => text.includes(keyword));
        }

        /**
         * 核心功能：打开链接或保存链接（根据type区分）
         * @param {number} type - 1=打开链接，2=保存链接
         */
        openList(type) {
            // 1. 校验表格元素是否存在
            const table = document.getElementById('ajaxtable');
            if (!table) {
                console.warn('未找到id为"ajaxtable"的表格，无法处理链接');
                return;
            }

            // 2. 筛选有效a标签：基础有效性+关键词过滤（仅保存时过滤）
            const validATags = Array.from(table.getElementsByTagName('a'))
                .filter(link => {
                    const href = link.getAttribute('href');
                    const linkText = link.textContent.trim();
                    // 基础校验：href包含read.php，且不包含无效参数
                    const isHrefValid = href && href.includes('html_data/') &&
                        !href.includes('thread.php') && !href.includes('&page=');
                    // 关键词过滤：仅type=2（保存）时生效
                    const isTextValid = type !== 2 || !this.isFiltered(linkText);
                    return isHrefValid && isTextValid;
                });

            // 3. 处理链接格式并去重
            const linksData = validATags
                .map(link => {
                    const href = link.getAttribute('href');
                    // 根据type返回不同格式的链接
                    return type === 1 ? href : `https://10012.c604c6n.cc:2096/pw/${href}`;
                })
                .filter((link, index, self) => self.findIndex(item => item === link) === index); // 去重

            // 4. 无有效链接时提示
            if (linksData.length === 0) {
                const tip = type === 2
                    ? '未找到符合条件的链接（已过滤包含关键词的链接）'
                    : '未找到包含"read.php"的有效链接';
                console.log(tip);
                return;
            }

            // 5. 根据type执行对应操作
            type === 1 ? this.batchOpenLinks(linksData) : this.saveLinks(linksData, validATags);
        }

        /**
         * 分批打开链接（避免一次性打开过多标签页）
         * @param {Array<string>} links - 待打开的链接数组
         */
        batchOpenLinks(links) {
            const batchSize = 5; // 每批打开数量
            const delay = 15000; // 批次间隔（毫秒）

            // 递归分批打开逻辑
            const openInBatches = (index) => {
                if (index >= links.length) {
                    console.log('所有链接已处理完毕', this.pageFrom);
                    this.handleNextPage(); // 处理翻页
                    return;
                }

                // 计算当前批次范围
                const end = Math.min(index + batchSize, links.length);
                // 打开当前批次链接
                for (let i = index; i < end; i++) {
                    window.open(`${links[i]}&pageFrom=image`, '_blank');
                    console.log(`已打开第${i+1}/${links.length}个链接: ${links[i]}`);
                }

                // 延迟执行下一批
                setTimeout(() => openInBatches(end), delay);
            };

            // 启动第一批打开
            openInBatches(0);
        }

        /**
         * 保存链接到接口：dataKey使用a标签文本，自动过滤关键词
         * @param {Array<string>} links - 待保存的完整链接数组
         * @param {Array<HTMLLinkElement>} validATags - 过滤后的a标签数组
         */
        saveLinks(links, validATags) {
            // 1. 建立「链接-文本」映射表，方便快速匹配
            const hrefToTextMap = validATags.reduce((map, link) => {
                const href = link.getAttribute('href');
                const fullHref = `https://10012.c604c6n.cc:2096/pw/${href}`;
                map.set(fullHref, link.textContent.trim());
                return map;
            }, new Map());

            // 2. 构造接口提交数据
            const postData = links.map(link => ({
                dataType: 'V33-IMG-鸥媚',
                dataContent: link, // 链接地址
                dataKey: hrefToTextMap.get(link) || link // a标签文本（无文本时用链接兜底）
            }));

            // 3. 打印提交日志（方便调试）
            console.log(`共筛选出${postData.length}条有效链接，准备提交接口`);

            // 4. 发送POST请求保存数据
            $.ajax({
                url: `${this.serveApiHost}api/v1/general-data/batch-save`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(postData),
                dataType: 'json',
                success: (response) => {
                    console.log('链接保存成功', response);
                    this.handleNextPage(); // 保存成功后处理翻页
                },
                error: (xhr, status, error) => {
                    console.error('链接保存失败', error);
                    console.log('错误状态码：', xhr.status);
                }
            });
        }

        /**
         * 处理翻页逻辑：根据pageFrom参数自动跳转到下一页
         */
        handleNextPage() {
            console.log('handleNextPage------',this.pageFrom,this.page,this.urlObj)
            if (['wode', 'novels'].includes(this.pageFrom) && this.page ) {
                const nextPage = parseInt(this.page, 10) + 1;
                console.log('nextPage------',nextPage,this.urlObj.toString())
                this.urlObj.searchParams.set('page', nextPage);
                this.urlObj.searchParams.set('pageFrom', this.pageFrom);
                window.location.href = this.urlObj.toString();
            }
        }

        /**
         * 详情页：获取所有图片URL（逗号分隔）
         * @returns {string} 所有图片URL的拼接字符串
         */
        getAllImageUrls() {
            return Array.from(document.getElementsByTagName('img'))
                .map(img => img.src)
                .filter(src => src) // 过滤空地址
                .join(',');
        }

        /**
         * 详情页：保存图片信息到接口
         */
        saveImgs() {
            // 1. 构造提交数据
            const postData = {
                url: this.currentUrl,
                title: $("#subject_tpc").text(),
                content: this.getAllImageUrls(),
                source: "v33图库-"
            };

            // 2. 过滤无效内容（无需保存的页面）
            if (postData.title.includes('立即下载') ||
                postData.title.includes('一帖收尽') ||
                postData.title.includes('谷歌浏览器用户')) {
                window.close();
                return;
            }

            // 3. 发送POST请求保存图片信息
            $.ajax({
                url: this.serveApi,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(postData),
                dataType: 'json',
                success: (response) => {
                    console.log('图片信息保存成功', response);
                    setTimeout(() => window.close(), 2000); // 2秒后关闭页面
                },
                error: (xhr, status, error) => {
                    console.error('图片信息保存失败', error);
                    console.log('错误状态码：', xhr.status);
                }
            });
        }
    }
})();
