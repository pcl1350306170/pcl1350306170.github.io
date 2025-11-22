/**
 * 文件操作弹窗组件
 * 用法:
 * 1. 在HTML中引入此脚本
 * 2. 调用 FileOperationModal.show(res) 显示弹窗，res为文件列表数组
 * 3. 确保页面已引入Vue和Element UI
 */
(function(window, Vue) {
    // 检查依赖
    if (!Vue || !window.Element) {
        console.error('请先引入Vue和Element UI');
        return;
    }

    // 创建组件容器
    const containerId = 'file-operation-modal-container';
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.display = 'none';
        document.body.appendChild(container);
    }

    // 组件模板
    container.innerHTML = `
        <el-dialog
            title="展示文件"
            :visible.sync="dialogVisible"
            width="50%"
            center
            @close="onClose"
        >
            <!-- 输入区域 -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center;">
                <el-input
                    v-model="chapter"
                    placeholder="章节"
                    style="flex: 1;"
                    clearable
                ></el-input>
                <el-input
                    v-model="targetPath"
                    placeholder="目标路径"
                    style="flex: 1;"
                    clearable
                ></el-input>
                <el-button type="success" @click="handleMergeAll">全部合并</el-button>
            </div>

            <!-- 文件列表 -->
            <div style="max-height: 60vh; overflow-y: auto;">
                <div
                    v-for="(file, index) in fileLists"
                    :key="index"
                    style="padding: 10px 0; border-bottom: 1px solid #abfff2; display: flex; justify-content: space-between; align-items: center;"
                >
                    <span style="width: 70%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                        {{ getFileName(file) }}
                    </span>
                    <div>
                        <el-button type="primary" size="mini" @click="handleMergeTxt(index)">合并</el-button>
                        <el-button type="primary" size="mini" style="margin-left: 10px;" @click="handleReplace(index)">替换</el-button>
                    </div>
                </div>
            </div>

            <!-- 底部按钮 -->
            <span slot="footer" style="text-align: center; display: block; width: 100%;">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="handleReplaceAll">全换</el-button>
                <el-button type="primary" @click="handleReplaceThreeAll">3个一盒【没写完】</el-button>
            </span>
        </el-dialog>
    `;

    // 创建Vue实例
    const vm = new Vue({
        el: '#' + containerId,
        data() {
            return {
                dialogVisible: false,
                chapter: '',
                targetPath: '',
                fileLists: [],
                // 回调函数
                onReplaceAll: null,
                onReplaceThree: null,
                onClose: null
            };
        },
        methods: {
            getFileName(filePath) {
                const parts = filePath.split('\\');
                const fileName = parts[parts.length - 1] || '';
                const nameParts = fileName.split('.');
                return nameParts[0] || '';
            },
            handleMergeAll() {
                if (window.CommonFun && typeof window.CommonFun.fileMergeAll === 'function') {
                    window.CommonFun.fileMergeAll(this.chapter, this.targetPath);
                }
            },
            handleMergeTxt(index) {
                if (window.CommonFun && typeof window.CommonFun.fileMergeTxt === 'function') {
                    window.CommonFun.fileMergeTxt(index, this.chapter, this.targetPath);
                }
            },
            handleReplace(index) {
                if (window.CommonFun && typeof window.CommonFun.fileReplace === 'function') {
                    window.CommonFun.fileReplace(index, this.chapter, this.targetPath);
                }
            },
            handleReplaceAll() {
                if (typeof this.onReplaceAll === 'function') {
                    this.onReplaceAll({
                        chapter: this.chapter,
                        targetPath: this.targetPath
                    });
                }
                this.dialogVisible = false;
            },
            handleReplaceThreeAll() {
                if (typeof this.onReplaceThree === 'function') {
                    this.onReplaceThree({
                        chapter: this.chapter,
                        targetPath: this.targetPath
                    });
                }
            },
        }
    });

    // 暴露公共方法
    window.FileOperationModal = {
        /**
         * 显示文件操作弹窗
         * @param {Array} fileList - 文件路径数组
         * @param {Object} options - 配置选项
         * @param {Function} options.onReplaceAll - 全换按钮回调
         * @param {Function} options.onReplaceThree - 3个一横按钮回调
         * @param {Function} options.onClose - 弹窗关闭回调
         */
        show(fileList, options = {}) {
            vm.fileLists = fileList || [];
            vm.chapter = '';
            vm.targetPath = '';
            vm.onReplaceAll = options.onReplaceAll;
            vm.onReplaceThree = options.onReplaceThree;
            vm.onClose = options.onClose;
            vm.dialogVisible = true;

            document.getElementById(containerId).style.display = 'block';
        },
        /**
         * 关闭弹窗
         */
        close() {
            vm.dialogVisible = false;
        }
    };
})(window, Vue);
