<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>修改</title>
    <link href="../../lib/layui/css/layui.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css" href="../../lib/bootstrap/css/bootstrap.css"/>

    <script src="../../lib/layui/layui.all.js" type="text/javascript"></script>
    <script src="../../lib/layui/lay/modules/layer.js" type="text/javascript"></script>
    <script src="../../js/jquery-1.8.3.min.js" type="text/javascript"></script>
    <script src="../../js/_variable.js" type="text/javascript"></script>


    <script src="js/modify.js" type="text/javascript"></script>
</head>
<style>
    .div-gjc span{
        margin: 2px 8px;
    }
</style>
<script>
    var itemId = ''
    $(function () {
        var paras = location.search;            //search获得地址中的参数，内容为'?itemId=12'
        var result = paras.match(/[^\?&]*=[^&]*/g);     //match是字符串中符合的字段一个一个取出来，result中的值为['login=xx','table=admin']
        paras = {};                    //让paras变成没有内容的json对象
        for (i in result) {
            var temp = result[i].split('=');    //split()将一个字符串分解成一个数组,两次遍历result中的值分别为['itemId','xx']
            paras[temp[0]] = temp[1];
        }
        itemId = paras.id;     //根据参数名"itemId"，获取参数值
        getmodifyDetail()
    })
</script>
<body>

<table class="table table-bordered">
    <tr>
        <td class="text-right tdTit" width="15%">标题</td>
        <td>
            <input type="text" id="field_title" name="field_title" class="form-control" style="width:50%"
                   placeholder="请填写标题（必填项）"/>
        </td>
    </tr>
    <tr>
        <td class="text-right tdTit" width="15%">关键词</td>
        <td>
            <input type="text" id="field_gjc" name="field_title" class="form-control" style="width:50%"
                   placeholder="请填写关键词"/>
            <div style="margin-top: 15px;" class="div-gjc"></div>
        </td>
    </tr>
    <tr>
        <td class="text-right tdTit" width="15%">类型</td>
        <td>
            <select class="form-control" id="field_type" style="width:50%">
                <option value="杂七杂八">杂七杂八</option>
                <option value="博文">博文</option>
                <option value="笔记">笔记</option>
                <option value="油猴脚本">油猴脚本</option>
                <option value="太平广记">太平广记</option>
            </select>
        </td>
    </tr>
    <tr>
        <td class="text-right tdTit" width="15%">内容</td>
        <td>
            <textarea name="txtContent" id="txtContent" style="width:98%;height:800px;"></textarea>
        </td>
    </tr>


    <tr>
        <td class="text-center" colspan="2">
            <button class="btn btn-primary" onClick="saveEvent()">保存</button>
            <button class="btn btn-default" onClick="operation('list')">返回</button>
        </td>
    </tr>
</table>
<!--初始化uedit-->
<script id="txtContent" name="txtContent" type="text/plain"></script>
<script type="text/javascript"
        src="../../lib/ueditor/ueditor.config.js"></script>
<script type="text/javascript"
        src="../../lib/ueditor/ueditor.all.js"></script>
<script type="text/javascript">
    var ue = UE.getEditor('txtContent', {
        toolbars: [
            [
                // 'anchor', //锚点
                'undo', //撤销
                'redo', //重做
                'bold', //加粗
                'indent', //首行缩进
                'snapscreen', //截图
                'italic', //斜体
                'underline', //下划线
                'strikethrough', //删除线
                'subscript', //下标
                'fontborder', //字符边框
                'superscript', //上标
                'formatmatch', //格式刷
                'source', //源代码
                //'blockquote', //引用
                'pasteplain', //纯文本粘贴模式
                'selectall', //全选
                //'print', //打印
                //'preview', //预览
                //'horizontal', //分隔线
                'removeformat', //清除格式
                'time', //时间
                'date', //日期
                //'unlink', //取消链接
                //'insertrow', //前插入行
                //'insertcol', //前插入列
                //'mergeright', //右合并单元格
                //'mergedown', //下合并单元格
                //'deleterow', //删除行
                //'deletecol', //删除列
                //'splittorows', //拆分成行
                //'splittocols', //拆分成列
                //'splittocells', //完全拆分单元格
                //'deletecaption', //删除表格标题
                //'inserttitle', //插入标题
                //'mergecells', //合并多个单元格
                //'deletetable', //删除表格
                'cleardoc', //清空文档
                //'insertparagraphbeforetable', //"表格前插入行"
                'insertcode', //代码语言
                'fontfamily', //字体
                'fontsize', //字号
                'paragraph', //段落格式
                'simpleupload', //单图上传
                'insertimage', //多图上传
                //'edittable', //表格属性
                //'edittd', //单元格属性
                //'link', //超链接
                'emotion', //表情
                'spechars', //特殊字符
                //'searchreplace', //查询替换
                //'map', //Baidu地图
                //'gmap', //Google地图
                //'insertvideo', //视频
                //'help', //帮助
                'justifyleft', //居左对齐
                'justifyright', //居右对齐
                'justifycenter', //居中对齐
                'justifyjustify', //两端对齐
                'forecolor', //字体颜色
                //'backcolor', //背景色
                //'insertorderedlist', //有序列表
                //'insertunorderedlist', //无序列表
                //'fullscreen', //全屏
                //'directionalityltr', //从左向右输入
                //'directionalityrtl', //从右向左输入
                //'rowspacingtop', //段前距
                //'rowspacingbottom', //段后距
                //'pagebreak', //分页
                //'insertframe', //插入Iframe
                //'imagenone', //默认
                //'imageleft', //左浮动
                //'imageright', //右浮动
                //'attachment', //附件
                //'imagecenter', //居中
                //'wordimage', //图片转存
                'lineheight', //行间距
                //'edittip ', //编辑提示
                'customstyle', //自定义标题
                'autotypeset', //自动排版
                //'webapp', //百度应用
                'touppercase', //字母大写
                'tolowercase', //字母小写
                //'background', //背景
                //'template', //模板
                //'scrawl', //涂鸦
                // 'music', //音乐
                //'inserttable', //插入表格
                //'drafts', // 从草稿箱加载
                //'charts', // 图表
            ]
        ]
    });
</script>
</body>
</html>
