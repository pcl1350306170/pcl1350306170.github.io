var URLL = window.location.href;
let R = '';
if(URLL.indexOf('pangchunlei') > -1) {
    R = 'http://pangchunlei.xyz/blog/php/'
} else if(URLL.indexOf('abeiyun') > -1) {
    R = 'http://ftp6263399.host108.abeiyun.cn/blog/php/'
} else {
    R = 'http://localhost:89/blog/php/'
}
const requestHttp = R

const ajaxSavemysqlPhp = 'http://localhost:89/mywww/php/savemysql.php'
const ajaxFileDealPhp = 'http://localhost:89/mywww/php/requestOnline.php'

// 处理ajaxFileDealJavaIP：从当前URL提取IP/域名并拼接端口28019
let ajaxFileDealJavaIP = '';
try {
    // 检查是否为 pcl1350306170.github.io 域名
    if (URLL.includes('pcl1350306170.github.io')) {
        // 特殊处理：使用指定IP
        ajaxFileDealJavaIP = 'http://192.168.18.218:28019';
    } else {
        // 创建URL对象解析当前地址
        const urlObj = new URL(URLL);
        // 提取协议（http:或https:）和主机名（包含IP或域名，不含端口）
        const protocol = urlObj.protocol;
        const hostname = urlObj.hostname;
        // 拼接成 "协议//主机名:28019" 格式
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
