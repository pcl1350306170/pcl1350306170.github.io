/**
 *  修改的js页面
 */
var ajaxUrl = requestHttp + 'requestData_zsd.php',
	showSuccess = true,
	menuId = '';
var gjcArray = [];
$(function () {

	console.log('shift + ctrl + ;  ===== 保存')
	console.log('shift + ctrl + F10  读取文件生成一个文件')




	$(document).keydown(function(e){
		e = e || window.event;
		var keyCode = e.keyCode || e.which || e.charCode;
		if(keyCode==13){
			createGJC();
		};


		var shiftKey = e.shiftKey || e.metaKey;//这里如果是检测ctrl键和其他键的话，就写e.ctrlKey
		var ctrlKey = e.ctrlKey || e.metaKey;//这里如果是检测ctrl键和其他键的话，就写e.ctrlKey

		// shift + ctrl + ;  备份数据库
		if(shiftKey && ctrlKey && e.keyCode == 186) {
			showSuccess = false
			saveEvent()
		}
		// shift + ctrl + F10  读取文件生成一个文件
		if(shiftKey && ctrlKey && e.keyCode == 121) {
			loadFiles()
		}
	});
})
function getmodifyDetail(){
	$.ajax({
		url: ajaxUrl, // 这是当前服务器的地址
		type: 'POST',
		data: {act: 'showdetail', zsdid: itemId},
		dataType: 'text',
		success: function (data) {
			let r = eval('(' + data + ')')

			$("#field_title").val(r[0]['title'])
			$("#field_gjc").val(r[0]['gjc'])
			$("#txtContent").val(r[0]['nr'])
			$("#field_type").val(r[0]['type'])
			createGJC()
		}

	});
}
function createGJC(){
	let v= $("#field_gjc").val();
	if(v === '' || !v)return
	let v2 = v.split(",")
	// gjcArray.push(v)
	gjcArray = [...gjcArray,...v2]

	let h = ''
	for(let i = 0 ; i < v2.length ; i++){
		if(v2[i] === '')continue
		h+='<span class="layui-badge layui-bg-blue" onclick="removeGjc(this)">'+v2[i]+'</span>'
	}

	$(".div-gjc").append(h)
	$("#field_gjc").val('');
}
function removeGjc(obj){
	let g = $(obj).text()
	let i = gjcArray.findIndex((v,i)=>{
		return v === g
	})
	gjcArray.splice(i,1)
	$(obj).remove()
	console.log(gjcArray)
}

function saveEvent(obj) {
	var field_title = $("#field_title").val(),			// 标题
		field_content = ue.getContent(),				// 内容
		field_gjc = gjcArray.join(",");//接收单位名称

	var imgReg = /<img.*?(?:>|\/>)/gi;
	var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
	var arr = field_content.match(imgReg);
	let imgs = []
	let field_images = ''
	let field_imgname = ''
	console.log(arr);
	if(arr !== null){
		for (var i = 0; i < arr.length; i++) {
			var src = arr[i].match(srcReg);
			//获取图片地址
			if(src[1]){
				imgs.push(src[1])
			}
		}
		field_images = imgs[0]
		field_imgname = imgs[0].replace('http://localhost:80/blog/zsdimage/','')
	}

	console.log(imgs);

	if (field_title == "") {
		alert("请填写标题!");
		return false;
	}


	var psotom = {
		act: 'modify',
		field_id: itemId,
		field_title: field_title,	// 标题
		field_content: field_content, // 内容
		field_gjc: field_gjc,
		field_type: $("#field_type").val(),
		field_images: field_images,
		field_imgname: field_imgname,
	};

	$.ajax({
		url: ajaxUrl,
		type: "POST",
		dataType: "TEXT",
		data: psotom,
		success: function (data) {
			if (data == '1') {
				if(showSuccess){
					layer.alert('修改成功', {icon: 1}, function (index) {
						location = location;
						//operation("list");
					});
				}
				showSuccess = true
			} else {
				layer.alert('添加失败', {icon: 2});
			}
		}
	});
}

function loadSavemysql(){
	$.ajax({
		url: ajaxSavemysqlPhp,
		type: "POST",
		dataType: "TEXT",
		data: {act: 'getTables'},
		success: function (data) {
			let r = data.split(',')
			let h = '<select class="form-control" id="field_table" style="width:50%;margin: 5vh auto;">' +
				'<option value="">所有</option>'
			for(let index of r.keys()){
				console.log(r[index])
				h += '<option value="'+r[index]+'">'+r[index]+'</option>'
			}
			h += ' </select>'

			let h2 = '<div style="width: 100%;height: 15vh;text-align: center;line-height: 15vh;">'+h+'</div>'
			layer.open({
				type:1,
				title : '备份数据库',
				area : ['40%','40%'],
				shade:0.6,
				closeBtn:0,    //不显示关闭
				btnAlign : 'c',//按钮居中
				content:h2 ,
				btn:["备份","关闭"],
				yes : function (index, layero){
					saveDatatable()
					layer.close(index);
				},btn2 : function (index, layero){
					// 取消
					layer.close(index);
				}
			})
		}
	});

}
// 备份数据库
function saveDatatable(){
	let datatable = $("#field_table").val();
	if(datatable === ''){
		layer.alert('填写备份表！', {icon: 2});
		return;
	}
	let psotom = {
		act: 'backuptable',
		datatable: datatable	// 数据库表名
	};
	$.ajax({
		url: ajaxSavemysqlPhp,
		type: "POST",
		dataType: "TEXT",
		data: psotom,
		success: function (data) {
			console.log(data)
			layer.alert(data, {icon: 1});
			$("#field_table").val('');
		}
	});
}

// 传一个文件路径，获取这个目录下的左右文件
function loadFiles() {
	let h = '<div><span style="display: inline-block;width: 160px;">文件路径：</span><input class="form-control" type="text" id="field_filepath" style="width:60%;margin: 2vh auto;display: inline-block;"></div>' +
		'<div><span style="display: inline-block;width: 160px;">文件保存路径：</span><input class="form-control" type="text" id="field_filesavepath" style="width:60%;margin: 5vh auto;display: inline-block;"></div>' +
		'<div><span style="display: inline-block;width: 160px;">文件名：</span><input class="form-control" type="text" id="field_filesavename" style="width:60%;margin: 5vh auto;display: inline-block;"></div>' +
		'<div><span style="display: inline-block;width: 160px;">筛选标题关键字：</span><input class="form-control" type="text" id="field_titleGJZ" style="width:60%;margin: 5vh auto;display: inline-block;"></div>'

	let h2 = '<div style="width: 100%;height: 15vh;text-align: center;line-height: 15vh;">'+h+'</div>'
	layer.open({
		type:1,
		title : '根据文件路径获取文件',
		area : ['80%','80%'],
		shade:0.6,
		closeBtn:0,    //不显示关闭
		btnAlign : 'a',//按钮居中
		content:h2 ,
		btn:["获取","关闭"],
		yes : function (index, layero){
			let field_filepath = $("#field_filepath").val()
			let field_filesavename = $("#field_filesavename").val()
			let field_filesavepath = $("#field_filesavepath").val()
			let field_titleGJZ = $("#field_titleGJZ").val()
			if(field_filepath === ''){
				layer.alert('填写文件路径！', {icon: 2});
				return;
			}
			let psotom = {
				act: 'loadFiles',
				field_filepath: field_filepath,	// 文件路径
				field_filesavepath:field_filesavepath,
				field_filesavename:field_filesavename,
				field_titleGJZ:field_titleGJZ
			};
			$.ajax({
				url: ajaxFileDealPhp,
				type: "POST",
				dataType: "TEXT",
				data: psotom,
				success: function (data) {
					console.log(data)
					layer.alert(data, {icon: 1});
				}
			});
			// layer.close(index);
		},btn2 : function (index, layero){
			// 取消
			layer.close(index);
		}
	})
}
