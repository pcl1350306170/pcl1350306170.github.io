/**
 * StorageHelper - 服务器信息持久化工具类
 * 用于保存/读取常用的服务器IP、配置等信息，基于 /api/v1/general-data 接口
 * 可在多个页面复用，通过 category 区分不同业务场景的数据
 * 默认使用共享的 IP 列表（DEFAULT_IP_CATEGORY），各页面共用同一套IP
 *
 * dataType 设计：统一使用 'server_host_info'
 *   - dataKey：IP/Host 值本身（保证唯一性）
 *   - dataContent：JSON字符串 { value, label, time }
 */
var StorageHelper = (function () {
    var DATA_TYPE = 'server_host_info';
    var DEFAULT_IP_CATEGORY = 'ip';

    // 本地缓存：{ ip: [{value, label, time}, ...] }
    var _cache = {};
    var _loaded = false;

    // 从API数据项转换为本地格式
    function _toLocalItem(item) {
        try {
            var content = typeof item.dataContent === 'string'
                ? JSON.parse(item.dataContent) : item.dataContent;
            return {
                value: content.value || item.dataKey || '',
                label: content.label || content.value || item.dataKey || '',
                time: content.time || item.updateTime || ''
            };
        } catch (e) {
            return { value: item.dataKey || '', label: item.dataKey || '', time: '' };
        }
    }

    // 从API加载指定分类的数据到缓存
    function _loadToCache(category) {
        var cat = category || DEFAULT_IP_CATEGORY;
        return axios.get(ajaxFileDealJavaIP + '/api/v1/general-data/get-by-type', {
            params: { dataType: DATA_TYPE }
        }).then(function (res) {
            var data = res.data;
            if (data && data.resultCode === 200 && data.data) {
                _cache[cat] = data.data.map(_toLocalItem);
            } else {
                _cache[cat] = [];
            }
            return _cache[cat];
        }).catch(function (e) {
            console.error('StorageHelper: 加载数据失败', e);
            return _cache[cat] || [];
        });
    }

    // 确保缓存已加载
    function _ensureLoaded(category) {
        var cat = category || DEFAULT_IP_CATEGORY;
        if (_cache[cat]) return Promise.resolve(_cache[cat]);
        return _loadToCache(cat);
    }

    // 在缓存列表中查找并移除重复项，然后插入到最前面
    function _dedupAndPrepend(list, newItem) {
        var existIndex = list.findIndex(function (item) {
            return item.value === newItem.value;
        });
        if (existIndex > -1) list.splice(existIndex, 1);
        list.unshift(newItem);
        if (list.length > 20) list = list.slice(0, 20);
        return list;
    }

    return {
        DEFAULT_IP_CATEGORY: DEFAULT_IP_CATEGORY,
        DATA_TYPE: DATA_TYPE,

        /**
         * 获取某个分类下的所有记录（首次从API加载，之后走缓存）
         * @param {string} [category] 分类名，不传则使用默认IP分类
         * @returns {Array} 记录列表（同步返回缓存数据）
         */
        getList: function (category) {
            var cat = category || DEFAULT_IP_CATEGORY;
            return _cache[cat] || [];
        },

        /**
         * 预加载数据（页面初始化时调用，确保后续 getList 有数据）
         * @param {string} [category]
         * @returns {Promise}
         */
        init: function (category) {
            return _loadToCache(category);
        },

        /**
         * 保存一条记录（自动去重，保留最新的）
         * 先查同类型下是否已存在相同 dataKey，存在则更新，不存在则新增
         * @param {string} category 分类名
         * @param {string} value 要保存的值
         * @param {string} [label] 可选的显示标签
         */
        save: function (category, value, label) {
            if (!value) return;
            var cat = category || DEFAULT_IP_CATEGORY;
            var newItem = {
                value: value,
                label: label || value,
                time: new Date().toLocaleString()
            };

            // 立即更新缓存（同步体验）
            if (!_cache[cat]) _cache[cat] = [];
            _dedupAndPrepend(_cache[cat], newItem);

            // 查找已有记录，决定是更新还是新增
            axios.get(ajaxFileDealJavaIP + '/api/v1/general-data/get-by-type', {
                params: { dataType: DATA_TYPE }
            }).then(function (res) {
                var data = res.data;
                var existing = null;
                if (data && data.resultCode === 200 && data.data) {
                    existing = data.data.find(function (item) {
                        return item.dataKey === value;
                    });
                }

                if (existing) {
                    // 已存在 → 更新
                    return axios.post(ajaxFileDealJavaIP + '/api/v1/general-data/update', {
                        id: existing.id,
                        dataContent: JSON.stringify(newItem)
                    }, { headers: { 'Content-Type': 'application/json' } });
                } else {
                    // 不存在 → 新增
                    return axios.post(ajaxFileDealJavaIP + '/api/v1/general-data/save', {
                        dataType: DATA_TYPE,
                        dataKey: value,
                        dataContent: JSON.stringify(newItem)
                    }, { headers: { 'Content-Type': 'application/json' } });
                }
            }).catch(function (e) {
                console.error('StorageHelper: 保存失败', e);
            });
        },

        /**
         * 删除一条记录
         * @param {string} category 分类名
         * @param {string} value 要删除的值
         */
        remove: function (category, value) {
            var cat = category || DEFAULT_IP_CATEGORY;

            // 立即更新缓存（同步体验）
            if (_cache[cat]) {
                _cache[cat] = _cache[cat].filter(function (item) {
                    return item.value !== value;
                });
            }

            // 查找记录ID并删除
            axios.get(ajaxFileDealJavaIP + '/api/v1/general-data/get-by-type', {
                params: { dataType: DATA_TYPE }
            }).then(function (res) {
                var data = res.data;
                if (data && data.resultCode === 200 && data.data) {
                    var target = data.data.find(function (item) {
                        return item.dataKey === value;
                    });
                    if (target) {
                        axios.get(ajaxFileDealJavaIP + '/api/v1/general-data/delete', {
                            params: { id: target.id }
                        });
                    }
                }
            }).catch(function (e) {
                console.error('StorageHelper: 删除失败', e);
            });
        },

        /**
         * 清空某个分类
         * @param {string} [category]
         */
        clear: function (category) {
            var cat = category || DEFAULT_IP_CATEGORY;
            _cache[cat] = [];

            axios.get(ajaxFileDealJavaIP + '/api/v1/general-data/get-by-type', {
                params: { dataType: DATA_TYPE }
            }).then(function (res) {
                var data = res.data;
                if (data && data.resultCode === 200 && data.data) {
                    data.data.forEach(function (item) {
                        axios.get(ajaxFileDealJavaIP + '/api/v1/general-data/delete', {
                            params: { id: item.id }
                        });
                    });
                }
            }).catch(function (e) {
                console.error('StorageHelper: 清空失败', e);
            });
        },

        /**
         * 获取某个分类下最新一条记录的值
         * @param {string} [category]
         * @returns {string|null}
         */
        getLatest: function (category) {
            var list = this.getList(category);
            return list.length > 0 ? list[0].value : null;
        }
    };
})();
