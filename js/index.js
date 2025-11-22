
function indexGetbowen(){
	getListData.limit = 3
	getListData.search_type = '博文'

	getListData.listDemo = '#ID_bowen'
	getListData.list_getdata();
}
//杂七杂八的知识点
function indexGetzaba() {
	getListData.limit = 4
	getListData.search_type = '杂七杂八'

	getListData.listDemo = '#ID_zaqizaba'
	getListData.list_getdata();
}
function indexGetbiji() {
	getListData.limit = 3
	getListData.search_type = '笔记'

	getListData.listDemo = '#ID_biji'
	getListData.list_getdata();
}
function indexGetMovie(){
	getListData.limit = 2
	getListData.requestPHP = requestHttp + 'requestData_movie.php'

	getListData.listDemo = '#ID_movie'
	getListData.list_getMoviedata();
	dealLocalTools.list()
}
// 新增本地功能
var dealLocalTools = {
	requestPHP: requestHttp + 'requestData_tools.php',
	listData: null,
	editI: '',
	addLocalTool(ty) {
		const _this = this
		let n = '<div class="addLocalTool">' +
			'<div><input type="text" id="field_name" name="field_title" class="form-control" style="width:50%" placeholder="请填写名称"/></div>' +
			'<div><input type="text" id="field_url" name="field_title" class="form-control" style="width:50%" placeholder="请填写跳转地址"/></div>' +
			'</div>'

		layer.open({
			type:1,
			title : '保存新工具',
			area : ['40%','40%'],
			shade:0.6,
			closeBtn:0,    //不显示关闭
			btnAlign : 'c',//按钮居中
			content:n ,
			btn:["确定","关闭"],
			yes : function (index, layero){
				dealLocalTools.add(ty)
			},btn2 : function (index, layero){
				//
				layer.close(index);
			}
		})
		if(ty === 'edit'){
			$("#field_name").val(_this.listData[_this.editI]['name'])
			$("#field_url").val(_this.listData[_this.editI]['url'])
		}
	},
	add(ty){
		const _this = this
		let field_name = $("#field_name").val()
		let field_url = $("#field_url").val()
		if(field_name === '' || field_url === ''){
			layer.alert('输入为空？保存神呢？？', {icon: 2});
			return
		}
		let psotom = {
			act: 'add',
			field_name: field_name,
			field_url: field_url
		}
		if(ty && ty === 'edit'){
			psotom.act = 'edit'
			psotom.id = _this.listData[_this.editI]['id']
		}
		$.ajax({
			url: _this.requestPHP,
			type: "POST",
			dataType: "TEXT",
			data: psotom,
			success: function (data) {
				if (data == '' || data == 1) {
					layer.alert('成功', {icon: 1}, function (index) {
						_this.list()
						//location = location;
						//operation("list");
					});
				} else {
					layer.alert('失败', {icon: 2});
				}
			}
		});
	},
	list(){
		const _this = this
		let psotom = {
			act:'list'
		}
		$.ajax({
			url: _this.requestPHP,
			type: "POST",
			dataType: "TEXT",
			data: psotom,
			success: function (data) {
				let r = eval('(' + data + ')')
				_this.listData = r
				let h = ''
				for(let i = 0 ; i < r.length ; i++){
					h += '<li>' +
						'<a href="'+r[i]['url']+'" target="_blank">'+r[i]['name']+'</a> ' +
						'<div class="action">' +
							'<i class="iconfont icon-icon_function_xiugai edit" onclick="dealLocalTools.edit(\''+i+'\')"></i>' +
							'<i class="iconfont icon-shanchu del" onclick="dealLocalTools.del(\''+r[i]['id']+'\')"></i>' +
						'</div>' +
						'</li>'
				}
				$("#localhosttool ul").html(h)
				layer.closeAll()
			}
		});
	},
	del(id){
		const _this = this
		let psotom = {
			act:'del',
			id: id
		}
		$.ajax({
			url: _this.requestPHP,
			type: "POST",
			dataType: "TEXT",
			data: psotom,
			success: function (data) {
				if (data == 1) {
					layer.alert('成功', {icon: 1}, function (index) {
						_this.list()
					});
				} else {
					layer.alert('失败', {icon: 2});
				}
			}
		});
	},
	edit(i){
		const _this = this
		_this.editI = i
		_this.addLocalTool('edit')
	},
}