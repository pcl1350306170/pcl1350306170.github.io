/**
 * GeneralDataApi - /api/v1/general-data 通用数据接口封装
 *
 * 提供统一的增删改查方法，所有需要操作 general-data 的页面均可直接调用。
 * 依赖：axios、_variable.js（ajaxFileDealJavaIP）
 *
 * 使用方式：
 *   <script src="../../lib/vue/axios.min.js"></script>
 *   <script src="../../js/_variable.js"></script>
 *   <script src="../../js/GeneralDataApi.js"></script>
 *
 *   // 保存
 *   GeneralDataApi.save({ dataType: 'xxx', dataKey: 'yyy', dataContent: 'zzz' })
 *       .then(function(data) { ... });
 *
 *   // 智能保存（自动判断新增或更新）
 *   GeneralDataApi.saveOrUpdate('xxx', 'yyy', 'zzz')
 *       .then(function(data) { ... });
 *
 *   // 按类型查询
 *   GeneralDataApi.getByType('xxx')
 *       .then(function(list) { ... });
 *
 * 接口说明：
 * | 方法 | 路径              | 说明                                     |
 * |------|-------------------|------------------------------------------|
 * | POST | /save             | 保存单条（传 dataKey 会检查同类型下是否已存在）|
 * | POST | /batch-save       | 批量保存（自动去重 dataContent）            |
 * | POST | /update           | 根据 ID 更新数据                          |
 * | GET  | /delete?id=       | 逻辑删除                                  |
 * | GET  | /get-by-id?id=    | 按 ID 查询                                |
 * | GET  | /get-by-type?dataType= | 按分类查询全部数据                    |
 */
var GeneralDataApi = (function () {
    var BASE = ajaxFileDealJavaIP + '/api/v1/general-data';
    var HEADERS = { 'Content-Type': 'application/json' };

    // 统一响应处理：成功返回 data，失败抛出错误
    function _handle(res) {
        var d = res.data;
        if (d && d.resultCode === 200) return d;
        var msg = (d && (d.message || d.desc)) || '接口返回异常';
        return Promise.reject(new Error(msg));
    }

    // 统一异常处理
    function _catch(e) {
        console.error('GeneralDataApi:', e.message || e);
        return Promise.reject(e);
    }

    return {
        /**
         * 保存单条数据
         * @param {Object} params - { dataType, dataKey?, dataContent }
         * @returns {Promise} resolve(data) - data 包含保存后的记录（含 id）
         */
        save: function (params) {
            return axios.post(BASE + '/save', params, { headers: HEADERS })
                .then(_handle).catch(_catch);
        },

        /**
         * 批量保存
         * @param {Array} list - [{ dataType, dataKey?, dataContent }, ...]
         * @returns {Promise}
         */
        batchSave: function (list) {
            return axios.post(BASE + '/batch-save', list, { headers: HEADERS })
                .then(_handle).catch(_catch);
        },

        /**
         * 根据 ID 更新数据
         * @param {string|number} id - 记录 ID
         * @param {Object} fields - 要更新的字段，如 { dataContent: 'xxx' }
         * @returns {Promise}
         */
        update: function (id, fields) {
            var payload = Object.assign({}, fields, { id: id });
            return axios.post(BASE + '/update', payload, { headers: HEADERS })
                .then(_handle).catch(_catch);
        },

        /**
         * 逻辑删除
         * @param {string|number} id - 记录 ID
         * @returns {Promise}
         */
        remove: function (id) {
            return axios.get(BASE + '/delete', { params: { id: id } })
                .then(_handle).catch(_catch);
        },

        /**
         * 按 ID 查询
         * @param {string|number} id
         * @returns {Promise} resolve(data) - data 为单条记录对象
         */
        getById: function (id) {
            return axios.get(BASE + '/get-by-id', { params: { id: id } })
                .then(_handle).catch(_catch);
        },

        /**
         * 按分类查询全部数据
         * @param {string} dataType
         * @returns {Promise} resolve(data) - data 为记录数组
         */
        getByType: function (dataType) {
            return axios.get(BASE + '/get-by-type', { params: { dataType: dataType } })
                .then(function (res) {
                    var d = res.data;
                    if (d && d.resultCode === 200) {
                        return d.data || [];
                    }
                    return Promise.reject(new Error((d && d.message) || '查询失败'));
                })
                .catch(_catch);
        },

        /**
         * 智能保存：根据 dataKey 判断已存在则更新，不存在则新增
         * @param {string} dataType - 数据分类
         * @param {string} dataKey - 唯一标识
         * @param {*} dataContent - 数据内容
         * @returns {Promise}
         */
        saveOrUpdate: function (dataType, dataKey, dataContent) {
            var self = this;
            return self.getByType(dataType).then(function (list) {
                var existing = list.find(function (item) {
                    return item.dataKey === dataKey;
                });
                if (existing) {
                    return self.update(existing.id, { dataContent: dataContent });
                } else {
                    return self.save({
                        dataType: dataType,
                        dataKey: dataKey,
                        dataContent: dataContent
                    });
                }
            });
        },

        /**
         * 按 dataKey 删除（先查询再删除）
         * @param {string} dataType - 数据分类
         * @param {string} dataKey - 要删除的 dataKey
         * @returns {Promise}
         */
        removeByKey: function (dataType, dataKey) {
            var self = this;
            return self.getByType(dataType).then(function (list) {
                var target = list.find(function (item) {
                    return item.dataKey === dataKey;
                });
                if (target) {
                    return self.remove(target.id);
                }
                return Promise.reject(new Error('未找到 dataKey=' + dataKey + ' 的记录'));
            });
        },

        /**
         * 清空某个 dataType 下的全部数据
         * @param {string} dataType
         * @returns {Promise}
         */
        clearByType: function (dataType) {
            var self = this;
            return self.getByType(dataType).then(function (list) {
                return Promise.all(list.map(function (item) {
                    return self.remove(item.id);
                }));
            });
        }
    };
})();
