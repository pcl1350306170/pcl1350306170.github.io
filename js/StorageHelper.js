/**
 * StorageHelper - 本地持久化工具类
 * 用于保存/读取常用的服务器IP、配置等信息，基于 localStorage
 * 可在多个页面复用，通过 category 区分不同业务场景的数据
 * 默认使用共享的 IP 列表（DEFAULT_IP_CATEGORY），各页面共用同一套IP
 */
var StorageHelper = (function () {
    var STORAGE_KEY = 'app_saved_data';
    var DEFAULT_IP_CATEGORY = 'ip';

    function _getAll() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.error('StorageHelper: 读取本地数据失败', e);
            return {};
        }
    }

    function _saveAll(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('StorageHelper: 保存本地数据失败', e);
        }
    }

    return {
        DEFAULT_IP_CATEGORY: DEFAULT_IP_CATEGORY,

        /**
         * 获取某个分类下的所有记录
         * @param {string} [category] 分类名，不传则使用默认IP分类
         * @returns {Array} 记录列表
         */
        getList: function (category) {
            var all = _getAll();
            return all[category || DEFAULT_IP_CATEGORY] || [];
        },

        /**
         * 保存一条记录（自动去重，保留最新的）
         * @param {string} category 分类名，不传则使用默认IP分类
         * @param {string} value 要保存的值
         * @param {string} [label] 可选的显示标签
         */
        save: function (category, value, label) {
            if (!value) return;
            var cat = category || DEFAULT_IP_CATEGORY;
            var list = this.getList(cat);
            var existIndex = list.findIndex(function (item) {
                return item.value === value;
            });
            if (existIndex > -1) {
                list.splice(existIndex, 1);
            }
            list.unshift({
                value: value,
                label: label || value,
                time: new Date().toLocaleString()
            });
            if (list.length > 20) {
                list = list.slice(0, 20);
            }
            var all = _getAll();
            all[cat] = list;
            _saveAll(all);
        },

        /**
         * 删除一条记录
         * @param {string} category 分类名，不传则使用默认IP分类
         * @param {string} value 要删除的值
         */
        remove: function (category, value) {
            var cat = category || DEFAULT_IP_CATEGORY;
            var list = this.getList(cat);
            list = list.filter(function (item) {
                return item.value !== value;
            });
            var all = _getAll();
            all[cat] = list;
            _saveAll(all);
        },

        /**
         * 清空某个分类
         * @param {string} [category] 分类名，不传则使用默认IP分类
         */
        clear: function (category) {
            var all = _getAll();
            delete all[category || DEFAULT_IP_CATEGORY];
            _saveAll(all);
        },

        /**
         * 获取某个分类下最新一条记录的值
         * @param {string} [category] 分类名，不传则使用默认IP分类
         * @returns {string|null}
         */
        getLatest: function (category) {
            var list = this.getList(category);
            return list.length > 0 ? list[0].value : null;
        }
    };
})();
