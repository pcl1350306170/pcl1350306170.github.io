class StarField {
    /**
     * 创建一个星空背景动画
     * @param {Object} options - 配置选项
     * @param {string} options.canvasId - canvas元素的ID
     * @param {number} options.hue - 星空色调，默认217
     * @param {number} options.maxStars - 星星数量，默认1200
     * @param {string} options.backgroundColor - 背景颜色，默认'#060e1b'
     */
    constructor(options = {}) {
        // 默认配置
        this.config = {
            canvasId: 'canvas',
            hue: 217,
            maxStars: 1200,
            backgroundColor: '#060e1b'
        };

        // 合并用户配置
        Object.assign(this.config, options);

        // 初始化属性
        this.canvas = null;
        this.ctx = null;
        this.w = 0;
        this.h = 0;
        this.stars = [];
        this.count = 0;
        this.canvas2 = null;
        this.ctx2 = null;
        this.animationId = null;

        // 初始化
        this.init();
    }

    /**
     * 初始化星空动画
     */
    init() {
        // 获取canvas元素
        this.canvas = document.getElementById(this.config.canvasId);
        if (!this.canvas) {
            console.error(`未找到ID为${this.config.canvasId}的canvas元素`);
            return;
        }

        // 设置上下文
        this.ctx = this.canvas.getContext('2d');

        // 设置尺寸
        this.resize();

        // 创建渐变缓存
        this.createGradientCache();

        // 创建星星
        this.createStars();

        // 开始动画
        this.animate();

        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * 调整canvas尺寸
     */
    resize() {
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = window.innerHeight;

        // 设置背景颜色
        document.body.style.background = this.config.backgroundColor;
    }

    /**
     * 创建星星渐变缓存
     */
    createGradientCache() {
        this.canvas2 = document.createElement('canvas');
        this.ctx2 = this.canvas2.getContext('2d');
        this.canvas2.width = 100;
        this.canvas2.height = 100;

        const half = this.canvas2.width / 2;
        const gradient2 = this.ctx2.createRadialGradient(
            half, half, 0,
            half, half, half
        );

        gradient2.addColorStop(0.025, '#fff');
        gradient2.addColorStop(0.1, `hsl(${this.config.hue}, 61%, 33%)`);
        gradient2.addColorStop(0.25, `hsl(${this.config.hue}, 64%, 6%)`);
        gradient2.addColorStop(1, 'transparent');

        this.ctx2.fillStyle = gradient2;
        this.ctx2.beginPath();
        this.ctx2.arc(half, half, half, 0, Math.PI * 2);
        this.ctx2.fill();
    }

    /**
     * 生成随机数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 随机数
     */
    random(min, max) {
        if (arguments.length < 2) {
            max = min;
            min = 0;
        }

        if (min > max) {
            const hold = max;
            max = min;
            min = hold;
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 计算最大轨道半径
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @returns {number} 最大轨道半径
     */
    maxOrbit(x, y) {
        const max = Math.max(x, y);
        const diameter = Math.round(Math.sqrt(max * max + max * max));
        return diameter / 2;
    }

    /**
     * 创建星星对象（使用内部函数替代原型方法）
     */
    createStar() {
        const self = this;
        return {
            orbitRadius: self.random(self.maxOrbit(self.w, self.h)),
            radius: self.random(60, self.maxOrbit(self.w, self.h)) / 12,
            orbitX: self.w / 2,
            orbitY: self.h / 2,
            timePassed: self.random(0, self.config.maxStars),
            speed: self.random(self.maxOrbit(self.w, self.h)) / 900000,
            alpha: self.random(2, 10) / 10,

            /**
             * 绘制星星
             */
            draw() {
                const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
                const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
                const twinkle = self.random(10);

                if (twinkle === 1 && this.alpha > 0) {
                    this.alpha -= 0.05;
                } else if (twinkle === 2 && this.alpha < 1) {
                    this.alpha += 0.05;
                }

                self.ctx.globalAlpha = this.alpha;
                self.ctx.drawImage(
                    self.canvas2,
                    x - this.radius / 2,
                    y - this.radius / 2,
                    this.radius,
                    this.radius
                );
                this.timePassed += this.speed;
            }
        };
    }

    /**
     * 创建所有星星
     */
    createStars() {
        this.stars = [];

        for (let i = 0; i < this.config.maxStars; i++) {
            this.stars.push(this.createStar());
        }
    }

    /**
     * 动画循环
     */
    animate() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = `hsla(${this.config.hue}, 64%, 6%, 1)`;
        this.ctx.fillRect(0, 0, this.w, this.h);

        this.ctx.globalCompositeOperation = 'lighter';
        for (let i = 0, l = this.stars.length; i < l; i++) {
            this.stars[i].draw();
        }

        this.animationId = window.requestAnimationFrame(() => this.animate());
    }

    /**
     * 销毁动画，释放资源
     */
    destroy() {
        if (this.animationId) {
            window.cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', () => this.resize());
        this.stars = [];
    }

    /**
     * 更新星空配置
     * @param {Object} options - 新的配置选项
     */
    updateConfig(options) {
        Object.assign(this.config, options);
        this.createGradientCache();
        this.createStars();
    }
}

// 使用示例：
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 默认配置
    const starField = new StarField({
        canvasId: 'canvas',  // canvas元素的ID
        hue: 217,            // 星空色调
        maxStars: 1200       // 星星数量
    });

    // 可以通过以下方法更新配置
    // starField.updateConfig({ hue: 180, maxStars: 1500 });

    // 不需要时可以销毁
    // starField.destroy();
});
