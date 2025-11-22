// popup.js - 弹窗提醒组件
var Popup = (function () {
    return {
        /**
         * 普通提示（icon=1 成功，2 错误，0 警告，6 问号）
         * @param {string} msg - 提示内容
         * @param {number} icon - 图标编号（可选，默认1）
         * @param {function} callback - 可选回调
         */
        alert: function (msg, icon = 1, callback) {
            layer.msg(msg, { icon: icon, time: 2000 }, callback);
        },

        /**
         * 弹出确认框
         * @param {string} msg - 提示内容
         * @param {function} onConfirm - 点击确认的回调
         * @param {function} onCancel - 点击取消的回调（可选）
         */
        confirm: function (msg, onConfirm, onCancel) {
            layer.confirm(msg, { icon: 3, title: '提示' }, function (index) {
                if (typeof onConfirm === 'function') onConfirm();
                layer.close(index);
            }, function () {
                if (typeof onCancel === 'function') onCancel();
            });
        },

        /**
         * 加载中提示（需手动关闭）
         * @returns {number} loadingIndex - 返回 index，可用 layer.close(index) 关闭
         */
        loading: function () {
            return layer.msg('加载中...', {
                icon: 16,
                shade: 0.3,
                time: 0 // 不自动关闭
            });
        },

        /**
         * 自动关闭的加载提示（推荐用于快速反馈）
         * @param {string} msg - 内容
         */
        autoLoading: function (msg = '加载中...') {
            layer.msg(msg, { icon: 16, shade: 0.3, time: 1500 });
        },

        /**
         * 成功提示
         * @param {string} msg - 成功内容
         * @param {function} callback - 成功后的回调（可选）
         */
        success: function (msg, callback) {
            this.alert(msg, 1, callback);
        },

        /**
         * 错误提示
         * @param {string} msg - 错误内容
         * @param {function} callback - 失败后的回调（可选）
         */
        error: function (msg, callback) {
            this.alert(msg, 2, callback);
        }
    };
})();
