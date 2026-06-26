var URLL = window.location.href;
let R = '';
if (URLL.indexOf('pangchunlei') > -1) {
    R = 'http://pangchunlei.xyz/blog/php/'
} else if (URLL.indexOf('abeiyun') > -1) {
    R = 'http://ftp6263399.host108.abeiyun.cn/blog/php/'
} else {
    R = 'http://localhost:89/blog/php/'
}
const requestHttp = R

// 处理ajaxFileDealJavaIP：根据当前URL判断使用localhost还是其他环境的接口
let ajaxFileDealJavaIP = '';
try {
    // 创建URL对象解析当前地址
    const urlObj = new URL(URLL);
    const hostname = urlObj.hostname;
    const protocol = urlObj.protocol;

    // 检查是否为 pcl1350306170.github.io 域名
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // 如果是localhost或127.0.0.1，使用localhost接口
        ajaxFileDealJavaIP = 'http://localhost:28019';
    } else if (URLL.includes('pcl1350306170.github.io')) {
        // 特殊处理：使用指定IP
        ajaxFileDealJavaIP = 'http://192.168.18.228:28019';
    } else {
        // 其他情况：从当前URL提取IP/域名并拼接端口28019
        ajaxFileDealJavaIP = `${protocol}//${hostname}:28019`;
    }
} catch (e) {
    // 解析失败时使用默认值
    console.error('解析URL失败，使用默认值:', e);
    ajaxFileDealJavaIP = 'http://localhost:28019';
}

// 示例验证
console.log('当前URL:', URLL);
console.log('处理后的ajaxFileDealJavaIP:', ajaxFileDealJavaIP);
