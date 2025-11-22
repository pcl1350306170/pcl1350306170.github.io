var CommonFun = {
    fileLists: [],
    commonUseText: [],
    varTimeOut: null,
    simpleCrawlerNum: 0,
    simpleCrawlerTimeOut: null,

    // 初始化 - 确保Vue实例和axios可用
    init() {
        if (typeof axios === 'undefined') {
            console.error('请先引入axios库');
        }
        if (typeof Vue === 'undefined' || !Vue.prototype.$message || !Vue.prototype.$alert || !Vue.prototype.$confirm) {
            console.error('请确保Element UI已正确引入并注册');
        }
    },

    // 合并txt文件
    hebingTXT(data) {
        data.act = 'loadFiles';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                console.log(response.data);
                Vue.prototype.$alert(response.data, '操作结果', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('操作失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 编辑文件名
    fileEdit(data) {
        const d = {
            path: data.field_path,
            keyword: data.field_titlegjz,
            replacement: data.field_titletogjz,
        };
        axios.post(ajaxFileDealJavaIP + '/file-tools/replace-name', d)
            .then(response => {
                console.log(response.data);
                Vue.prototype.$alert("保存成功！", '操作成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert("操作失败: " + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 获取指定目录下的所有图片，根据最早的时间重命名，并移动到指定目录
    getAllImages(data) {
        data.act = 'getAllImages';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                console.log(response.data);
                Vue.prototype.$alert(response.data, '操作结果', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('操作失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 获取指定目录下的所有文件，并移动到指定目录
    getAllFiles(data) {
        data.act = 'getAllFiles';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                console.log(response.data);
                Vue.prototype.$alert(response.data, '操作结果', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('操作失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 根据分辨率删除不符合要求的壁纸
    fileDelImage(data) {
        data.act = 'fileDelImage';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                console.log(response.data);
                Vue.prototype.$alert(response.data, '操作结果', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('操作失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 没有后缀名的图片批量修改图片的后缀名
    suffixImg(data) {
        data.act = 'suffixImg';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                Vue.prototype.$alert(response.data, '操作结果', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('操作失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    pptxToPDF(data) {
        const d = {"sourceDir": "F:\\阿里云盘下载\\2025", "outputDir": "F:\\阿里云盘下载\\2025"};
        axios.post(ajaxFileDealJavaIP + '/file/mergePPTToPDF', d)
            .then(response => {
                console.log("成功：", response.data);
                Vue.prototype.$alert("操作成功！", '操作成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.log("错误信息:", error);
                Vue.prototype.$alert('操作失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 小说替换字段
    substrText(data) {
        const p = {
            id: 1,
            newString: data.field_newText,
            oldString: data.field_oldText
        };
        axios.post(ajaxFileDealJavaIP + '/ornographic-r-str/save', p)
            .then(response => {
                showPage('substrText');
                Vue.prototype.$alert("保存成功！", '操作成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('操作失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 获取常用的替换字段
    getCommonUse(data) {
        const _this = this;
        axios.get(ajaxFileDealJavaIP + '/ornographic-r-str/list', {params: {act: 'getCommonUse'}})
            .then(response => {
                _this.commonUseText = response.data;
                let R = _this.commonUseText;

                let h2 = '<div style="width: 80%;min-height: 15vh;text-align: left;margin: 15px auto;">';
                for (let i = 0; i < R.length; i++) {
                    h2 += '<button type="button" class="el-button el-button--primary" style="font-size: 20px;padding: 5px 10px;margin: 10px;" onclick="CommonFun.useCommonText(' + i + ')"><span>' + R[i]['newString'] + '</span></button>';
                }
                h2 += '</div>';
                document.getElementById("common-use").innerHTML = h2;
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('获取数据失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    useCommonText(i) {
        const t = this.commonUseText[i]['newString'];
        document.getElementById("field_newText").value = t;
    },

    // 小说字符替换
    substrTextPath(data) {
        const d = {
            directoryPath: data.field_textPath
        };
        axios.post(ajaxFileDealJavaIP + '/blog-api/v1/files/replace-text-by-path', d)
            .then(response => {
                console.log(response.data);
                Vue.prototype.$alert("保存成功！", '操作成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert("操作失败: " + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 获取路径下的所有文件
    getAllContent(data) {
        const _this = this;
        data.act = 'getAllContent';
        axios.post(ajaxFileDealJavaIP + '/txt-gateway/getAllFiles', data)
            .then(response => {
                if (response.data.resultCode === 200) {

                    _this.showFiles(response.data.data);
                } else {
                    Vue.prototype.$alert(response.data.message, '操作失败', {
                        confirmButtonText: '确定',
                        type: 'error'
                    });
                }
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('获取文件或代码执行失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    renameAllContent(data) {
        const _this = this;
        axios.post(ajaxFileDealJavaIP + '/txt-gateway/renameAllContent', data)
            .then(response => {
                Vue.prototype.$alert("重命名成功！", '操作成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('重命名失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    showFiles(res) {
       // console.log('show-Files----\n', JSON.stringify(res));

        // 显示文件操作弹窗
        FileOperationModal.show(res, {
            // 全换按钮回调
            onReplaceAll: function(params) {
                console.log('执行全换操作', params);
                // 这里写你的全换逻辑
            },
            onReplaceThree: function(params) {
                console.log('执行3个一盒操作', JSON.stringify(res));
                // 这里写你的全换逻辑
            },
            // 弹窗关闭回调
            onClose: function() {
                console.log('弹窗已关闭');
            }
        });
    },

    fileReplaceAll() {
        const _this = this;
        if (document.querySelectorAll('.h-fileMergeTxt').length > 0) {
            _this.startfileReplaceAll();
        }
    },

    startfileReplaceAll() {
        const _this = this;
        const elements = document.querySelectorAll('.h-fileMergeTxt');
        console.log(elements[0]?.textContent, elements.length);

        if (elements.length === 0) {
            clearTimeout(_this.varTimeOut);
            return;
        }

        elements[0].querySelector('.btn-fileReplace').click();
        _this.varTimeOut = setTimeout(function () {
            elements[0].remove();
            _this.startfileReplaceAll();
        }, 1000);
    },

    fileReplace(i) {
        this.substrTextPath({field_textPath: this.fileLists[i]});
    },

    fileMergeAll() {
        const _this = this;
        if (document.querySelectorAll('.h-fileMergeTxt').length > 0) {
            _this.startMergeAll();
        }
    },

    startMergeAll() {
        const _this = this;
        const elements = document.querySelectorAll('.h-fileMergeTxt');
        console.log(elements[0]?.textContent, elements.length);

        elements[0].querySelector('.btn-fileMergeTxt').click();

        if (elements.length === 0) {
            clearTimeout(_this.varTimeOut);
            return;
        }

        _this.varTimeOut = setTimeout(function () {
            elements[0].remove();
            _this.startMergeAll();
        }, 1000);
    },

    fileMergeTxt(i) {
        const _this = this;
        let chapter = document.getElementById("ID_chapter").value,
            Target = document.getElementById("ID_Target").value;

        let v = _this.fileLists[i].split('\\'),
            n = v[v.length - 1],
            last = n.split('.'),
            lastName = last[0];

        _this.mergeTxt({
            field_zj: chapter,
            field_merPath: _this.fileLists[i].replace('\\' + n, ''),
            field_merName: lastName,
            field_tarPath: Target,
            type: 1
        });
    },

    // 合并txt
    mergeTxt(data) {
        data.act = 'mergeTxt';
        axios.post(ajaxFileDealJavaIP + '/txt-gateway/mergeTxt', data)
            .then(response => {
                Vue.prototype.$alert(response.data, '操作结果', {
                    confirmButtonText: '确定',
                    type: 'success'
                });

                if (data.type) {
                    let chapter = document.getElementById("ID_chapter").value;
                    chapter++;
                    document.getElementById("ID_chapter").value = chapter;
                }
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('合并失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    simpleCrawler(data) {
        axios.post(ajaxFileDealJavaIP+'/opex-crawler/example', {
            url: data.field_Path
        })
            .then(response => {
                Vue.prototype.$alert(response.data, '操作结果', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('爬取失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    movefiles(data) {
        axios.post(ajaxFileDealJavaIP+'/blog-api/v1/files/move-files', data)
            .then(response => {
                if (response.data.resultCode === 200) {
                    Vue.prototype.$alert(response.data.message, '操作成功', {
                        confirmButtonText: '确定',
                        type: 'success'
                    });
                } else {
                    Vue.prototype.$alert(response.data.message, '操作失败', {
                        confirmButtonText: '确定',
                        type: 'error'
                    });
                }
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('移动文件失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    deletefiles(data) {
        axios.post(ajaxFileDealJavaIP+'/blog-api/v1/files/delete-files', data)
            .then(response => {
                Vue.prototype.$alert("文件删除成功！", '操作成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('删除文件失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    deletefilesdedup(data) {
        axios.post(ajaxFileDealJavaIP+'/blog-api/v1/files/delete-files-dedup', data)
            .then(response => {
                Vue.prototype.$alert("文件去重成功！", '操作成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('文件去重失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    mergefiles(data) {
        console.log('mergefiles====', JSON.stringify(data));
        axios.post(ajaxFileDealJavaIP+'/blog-api/v1/files/merge-files', data)
            .then(response => {
                let res = response.data
                if (res.resultCode === 200) {
                    Vue.prototype.$alert("文件合并成功！", '操作成功', {
                        confirmButtonText: '确定',
                        type: 'success'
                    });
                } else {
                    Vue.prototype.$alert(response.message, '操作失败', {
                        confirmButtonText: '确定',
                        type: 'error'
                    });
                }

            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('文件合并失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    mergefilesToEpub(data) {
        console.log('mergefilesToEpub====', JSON.stringify(data));
        axios.post(ajaxFileDealJavaIP+'/api/epub/generate', data)
            .then(response => {
                Vue.prototype.$alert("EPUB文件生成成功！", '操作成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('EPUB生成失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    simpleCrawler2(data) {
        const _this = this;
        if (_this.simpleCrawlerTimeOut) clearTimeout(_this.simpleCrawlerTimeOut);

        if (_this.simpleCrawlerNum === 0) _this.simpleCrawlerNum = 1;
        else _this.simpleCrawlerNum++;

        if (_this.simpleCrawlerNum > 190) {
            _this.simpleCrawlerNum = 0;
            Vue.prototype.$alert("爬取完成！", '操作成功', {
                confirmButtonText: '确定',
                type: 'success'
            });
        } else {
            const newData = {
                field_Path: 'https://www.bqg46.cc/html/82925/' + _this.simpleCrawlerNum + '.html'
            };
            _this.simpleCrawler(newData);
            _this.simpleCrawlerTimeOut = setTimeout(() => {
                _this.simpleCrawler2();
            }, 1000);
        }
    },

    // 获取指定目录下的所有图片，并在页面上显示
    showAllImages(data) {
        data.act = 'showAllImages';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                const d = response.data.split('|');
                console.log(d);
                let image = '';
                for (let i = 0; i < d.length; i++) {
                    image += '<img src="' + d[i] + '" alt="">';
                }
                document.querySelector(".images").innerHTML = image;
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('获取图片失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 根据一个网页地址爬取网页信息
    onlinePaQu(data) {
        data.act = 'phppaqu';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                console.log(response.data);
                Vue.prototype.$alert(response.data, '爬取结果', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('爬取失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 在表story中，根据小说名，生成txt文件
    hstoryCreateTxt(data) {
        data.act = 'hstoryCreateTxt';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                console.log('写入文件状态：' + response.data);
                Vue.prototype.$alert("文件生成成功！", '操作成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('文件生成失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 获取这个小说中已经写入txt的记录，用于判断是否生成txt完成
    hstoryCreateTxtnum(data, callback) {
        data.act = 'hstoryCreateTxtnum';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                const r = JSON.parse(response.data);
                const num = r[0]['num'];
                console.log('当前尚未写入txt数量：' + num);
                if (Number(num) === 0) {
                    callback();
                }
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('获取数据失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 在表story中，根据小说名，删除数据
    hstoryDelete(data) {
        data.act = 'hstoryDelete';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                Vue.prototype.$alert(response.data, '操作结果', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('删除失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 在表story中，根据小说名，获取小说内容
    hstorygetNr(data) {
        data.act = 'hstorygetNr';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                console.log('获取在线内容：' + response.data);
                Vue.prototype.$alert("内容获取成功！", '操作成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('内容获取失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // 获取这个小说中为空的记录，用于判断是否爬取完成
    hstorygetNrNull(data, callback) {
        data.act = 'hstorygetNrNull';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                const r = JSON.parse(response.data);
                const num = r[0]['num'];
                console.log('当前尚未获取到内容数量：' + num);
                if (Number(num) === 0) {
                    callback();
                }
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('获取数据失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // uniapp测试数据：获取新闻
    UNNIAPP_getOnlineNr(data, callback) {
        axios.get('https://unidemo.dcloud.net.cn/api/news', {params: data})
            .then(response => {
                callback(response.data);
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('获取新闻失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    },

    // uniapp测试数据：保存新闻
    UNNIAPP_createNews(data) {
        data.act = 'UNNIAPP_createNews';
        axios.post(ajaxFileDealPhp, data)
            .then(response => {
                Vue.prototype.$alert("新闻保存成功！", '操作成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('请求错误:', error);
                Vue.prototype.$alert('新闻保存失败: ' + (error.response?.data?.message || error.message), '错误', {
                    confirmButtonText: '确定',
                    type: 'error'
                });
            });
    }
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    CommonFun.init();
});
