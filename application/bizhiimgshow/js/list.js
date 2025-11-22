var getListData = {
    requestPHP: requestHttp + 'requestData_bizhiimgs.php',
    page: 1,
    total: 0,
    limit: 48,
    search_gjz: '',
    search_type: '',
    listDemo: "#mainContainerList",
    list_getcount () {
        let _this = this
        $.ajax({
            url: _this.requestPHP, // 这是当前服务器的地址
            type: 'POST',
            data: {act: 'gcount'},
            dataType: 'text',
            success: function (data) {
                _this.total = data;
                layui.use(['laypage', 'layer'], function () {
                    var laypage = layui.laypage;

                    laypage.render({
                        elem: 'pagesdemo'
                        , count: Math.ceil(_this.total / _this.limit)*10
                        , first: '首页'
                        , last: '尾页'
                        , prev: '<em>←</em>'
                        , next: '<em>→</em>',
                        jump: function (obj, first) {
                            //obj包含了当前分页的所有参数，比如：
                            console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                            console.log(obj.limit); //得到每页显示的条数
                            _this.page = obj.curr

                            _this.list_getdata()
                            //首次不执行
                            if (!first) {
                                //list_getdata()
                            }
                        }
                    });
                })

            }

        });
    },
    list_getdata () {
        let _this = this
        $.ajax({
            async: false,
            url: _this.requestPHP, // 这是当前服务器的地址
            type: 'POST',
            data: {
                act: 'glist',
                page: _this.page,
                search_gjz: _this.search_gjz,
                search_type: _this.search_type,
                limit: _this.limit,
            },
            dataType: 'text',
            success: function (data) {
                let r = eval('(' + data + ')')

                let h = '';
                for (let i = 0; i < r.length; i++) {

                    let id='ID_'+i
                    h += '<div class="card">\n' +
                    '            <div class="img">\n' +
                    '                <img src="'+r[i]['src']+'" alt="" onclick="getListData.copythisid(\''+id+'\')">\n' +
                    '            </div>\n' +
                    '            <div class="name">\n' +
                    '                <input type="text" value="'+r[i]['src']+'" id="'+id+'">\n' +
                     '               <button type="button" class="layui-btn layui-btn-danger layui-btn-radius" onclick="getListData.del(\''+r[i]['id']+'\',this)">删除</button>' +
                    '            </div>\n' +
                    '        </div>'
                }

                $(_this.listDemo).html(h);
                $(".gototop").click()
            }
        });
    },
    copythisid(id){
        var Url=document.getElementById(id);
        Url.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
    },
    del(id,obj){
        const _this = this
        $.ajax({
            url: _this.requestPHP, // 这是当前服务器的地址
            type: 'POST',
            data: {act: 'del',id:id},
            dataType: 'text',
            success: function (data) {
                $(obj).parent().parent().remove()
            }

        });
    }
}

