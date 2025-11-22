var CommonFun = {
  fileLists: [],
  commonUseText: [],
  varTimeOut: null,
  simpleCrawlerNum: 0,
  simpleCrawlerTimeOut: null,
  // 合并txt文件
  hebingTXT (data) {
    data.act = 'loadFiles';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {
        console.log(data);
        layer.alert(data, { icon: 1 });
      }
    });
  },
  // 编辑文件名
  fileEdit (data) {
    data.act = 'editFileName';
    let d = {
      path:data.field_path,
      keyword:data.field_titlegjz,
      replacement:data.field_titletogjz,
    }
    $.ajax({
      // url: ajaxFileDealPhp,
      url: ajaxFileDealJavaIP + '/file-tools/replace-name',  // 后端接口地址
      type: "POST",
      dataType: "json",  // 期望服务器返回的数据类型
      contentType: "application/json",  // 请求头设置为 JSON 格式
      data: JSON.stringify(d),  // 将对象转换为 JSON 字符串
      success: function (data) {
        console.log(data);
        Popup.success("保存成功！");
      },
      error: function (res) {
        console.log('请求错误:', res);
        Popup.error("操作失败！");

      }
    });
  },
  // 获取指定目录下的所有图片，根据最早的事件重命名，并移动到指定目录
  getAllImages (data) {
    data.act = 'getAllImages';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {
        console.log(data);
        layer.alert(data, { icon: 1 });
      }
    });
  },
  // 获取指定目录下的所有文件，并移动到指定目录
  getAllFiles (data) {
    data.act = 'getAllFiles';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {
        console.log(data);
        layer.alert(data, { icon: 1 });
      }
    });
  },
  // 根据分辨率删除不符合要求的壁纸
  fileDelImage (data) {
    data.act = 'fileDelImage';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {
        console.log(data);
        layer.alert(data, { icon: 1 });
      }
    });
  },
  // 没有后缀名的图片批量修改图片的后缀名
  suffixImg (data) {
    data.act = 'suffixImg';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (res) {
        layer.alert(res, { icon: 1 });
      }
    });
  },
  pptxToPDF(data){
    let d = {"sourceDir":"F:\\阿里云盘下载\\2025","outputDir":"F:\\阿里云盘下载\\2025"}
    $.ajax({
      //url: ajaxFileDealJavaIP + '/file/mergePPT',  // 后端接口地址
      url: ajaxFileDealJavaIP + '/file/mergePPTToPDF',  // 后端接口地址
      type: "POST",  // 请求方法
      dataType: "json",  // 期望服务器返回的数据类型
      contentType: "application/json",  // 请求头设置为 JSON 格式
      data: JSON.stringify(d),  // 将对象转换为 JSON 字符串
      success: function (res) {
        console.log("成功：", res);
        // 如果有成功的回调逻辑，可以在这里处理
        // showPage('substrText');
      },
      error: function (err) {
        console.log("错误信息:", err);
        // 处理错误信息
      }
    });
  },
  // 小说替换字段
  substrText (data) {
    data.act = 'substrText';
    let p = {
      id:1,
      newString: data.field_newText,
      oldString: data.field_oldText
    }
    $.ajax({
     // url: ajaxFileDealPhp,
     url:ajaxFileDealJavaIP+'/ornographic-r-str/save',
      type: "POST",
      dataType: "json",
      contentType:"application/json",
      data: JSON.stringify(p),
      success: function (res) {
        showPage('substrText');
      }
    });
  },
  // 获取常用的替换字段
  getCommonUse (data) {
    const _this = this;
    $.ajax({
      //url: ajaxFileDealPhp,
      url:ajaxFileDealJavaIP+'/ornographic-r-str/list',
      type: "GET",
      dataType: "JSON",
      data: { act: 'getCommonUse' },
      success: function (res) {

        let R = _this.commonUseText = res;

        let h2 = '<div style="width: 80%;min-height: 15vh;text-align: left;margin: 15px auto;">';
        for (let i = 0; i < R.length; i++) {
          h2 += '<button type="button" class="el-button el-button--primary" style="font-size: 20px;padding: 5px 10px;margin: 10px;" onclick="CommonFun.useCommonText(' + i + ')"><span>' + R[i]['newString'] + '</span></button>';
        }
        h2 += '</div>';
        $("#common-use").html(h2);
      }
    });
  },
  useCommonText (i) {
    const _this = this;
    let t = _this.commonUseText[i]['newString'];
    $("#field_newText").val(t);
  },

  // 小说字符替换
  substrTextPath (data) {
    /*data.act = 'substrTextPath';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (res) {
        layer.alert(res, { icon: 1 });
      }
    });*/
    let d = {
      directoryPath:data.field_textPath
    }
    $.ajax({
      // url: ajaxFileDealPhp,
      url: ajaxFileDealJavaIP + '/blog-api/v1/files/replace-text-by-path',  // 后端接口地址
      type: "POST",
      dataType: "json",  // 期望服务器返回的数据类型
      contentType: "application/json",  // 请求头设置为 JSON 格式
      data: JSON.stringify(d),  // 将对象转换为 JSON 字符串
      success: function (data) {
        console.log(data);
        Popup.success("保存成功！");
      },
      error: function (res) {
        console.log('请求错误:', res);
        Popup.error("操作失败！");
      }
    });
  },
  // 获取路径下的所有文件
  getAllContent (data) {
    const _this = this;
    data.act = 'getAllContent';
    $.ajax({
      //url: ajaxFileDealPhp,
      url:ajaxFileDealJavaIP+'/txt-gateway/getAllFiles',
      type: "POST",
      dataType: "JSON",
      data: data,
      success: function (res) {
        _this.showFiles(res);
      }
    });
  },
  renameAllContent (data) {
    const _this = this;
    $.ajax({
      url:ajaxFileDealJavaIP+'/txt-gateway/renameAllContent',
      type: "POST",
      dataType: "JSON",
      data: data,
      success: function (res) {
        Popup.success("重命名成功！");
      }
    });
  },
  showFiles (res) {
    const _this = this;
    let R = _this.fileLists = res;

    let h2 = '<div style="width: 100%;min-height: 15vh;text-align: left;line-height: 3vh;">' +
      '<div><input type="text" autocomplete="off" placeholder="章节" style="width: 20vw;" class="el-input__inner" id="ID_chapter"><input type="text"  style="width: 20vw;" autocomplete="off" placeholder="目标路径" class="el-input__inner" id="ID_Target"><button type="button" class="el-button el-button--success" style="float: right;font-size: 20px;padding: 5px 10px;" onclick="CommonFun.fileMergeAll()"><span>全部合并</span></button></div>' +
      '';
    for (let i = 0; i < R.length; i++) {
      let v = R[i].split('\\'),
        n = v[v.length - 1],
        last = n.split('.'),
        lastName = last[0];
      if (!lastName) continue;
      h2 += '<div style="padding: 10px 30px;font-size: 20px;border-bottom: 1px solid #abfff2;" class="h-fileMergeTxt"><span style="width:70%;overflow: hidden;white-space: nowrap;display: inline-block;">' + lastName + '</span><button type="button" class="el-button el-button--primary btn-fileReplace" style="float: right;font-size: 20px;padding: 5px 10px;margin: 0 10px;" onclick="CommonFun.fileReplace(' + i + ')"><span>替换</span></button><button type="button" class="el-button el-button--primary btn-fileMergeTxt" style="float: right;font-size: 20px;padding: 5px 10px;" onclick="CommonFun.fileMergeTxt(' + i + ')"><span>合并</span></button></div>';
    }
    h2 += '</div>';

    layer.open({
      type: 1,
      title: '展示文件',
      area: ['50%', '50%'],
      shade: 0.6,
      closeBtn: 0,    //不显示关闭
      btnAlign: 'c',//按钮居中
      content: h2,
      btn: ["全换", "关闭"],
      yes: function (index, layero) {
        _this.fileReplaceAll();
        //_this.fileMergeAll()
      }, btn3: function (index, layero) {
        // 取消
        layer.close(index);
      }
    });
  },
  fileReplaceAll () {
    const _this = this;
    if ($('.h-fileMergeTxt')) _this.startfileReplaceAll();
  },
  startfileReplaceAll () {
    const _this = this;
    console.log($('.h-fileMergeTxt').eq(0).text(),$('.h-fileMergeTxt').length);
    if($('.h-fileMergeTxt').length === 0){
      clearTimeout(_this.varTimeOut)
      return
    }
    $('.h-fileMergeTxt').eq(0).find('.btn-fileReplace').click();
    _this.varTimeOut = setTimeout(function () {
      $('.h-fileMergeTxt').eq(0).remove();
      _this.startfileReplaceAll();
    }, 1000);
  },
  fileReplace (i) {
    const _this = this;
    _this.substrTextPath({ field_textPath: _this.fileLists[i] });
  },
  fileMergeAll () {
    const _this = this;

    if ($('.h-fileMergeTxt')) _this.startMergeAll();
  },
  startMergeAll () {
    const _this = this;
    console.log($('.h-fileMergeTxt').eq(0).text(),$('.h-fileMergeTxt').length);
    $('.h-fileMergeTxt').eq(0).find('.btn-fileMergeTxt').click();
    if($('.h-fileMergeTxt').length === 0){
      clearTimeout(_this.varTimeOut)
      return
    }
    _this.varTimeOut = setTimeout(function () {
      $('.h-fileMergeTxt').eq(0).remove();
      _this.startMergeAll();
    }, 1000);

  },
  fileMergeTxt (i) {
    const _this = this;
    let chapter = $("#ID_chapter").val(),
      Target = $("#ID_Target").val();

    let v = _this.fileLists[i].split('\\'),
      n = v[v.length - 1],
      last = n.split('.'),
      lastName = last[0];

    _this.mergeTxt({
      field_zj: chapter,
      field_merPath: _this.fileLists[i].replace('\\' + n, ''),
      field_merName: lastName,
      field_tarPath: Target,
      type: 1
    });
  },

  // 合并txt
  mergeTxt (data) {
    data.act = 'mergeTxt';
    $.ajax({
      //url: ajaxFileDealPhp,
      url: ajaxFileDealJavaIP+'/txt-gateway/mergeTxt',
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (res) {
        layer.alert(res, { icon: 1 });
        if (data.type) {
          let chapter = $("#ID_chapter").val();
          chapter++;
          $("#ID_chapter").val(chapter);
        }
      }
    });
  },
  simpleCrawler (data) {
    $.ajax({
      //url: ajaxFileDealPhp,
      url: 'http://localhost:28019/opex-crawler/example',
      type: "POST",
      dataType: "TEXT",
      data: {
        url: data.field_Path
      },
      success: function (res) {
        layer.alert(res, { icon: 1 });
      }
    });
  },
  movefiles (data) {
    $.ajax({
      url: 'http://localhost:28019/blog-api/v1/files/move-files',
      type: "POST",
      dataType: "JSON",
      contentType: "application/json",  // 设置 contentType
      data: JSON.stringify(data),  // 将数据格式化为 JSON 字符串
      success: function (res) {
        if(res.resultCode===200){
          layer.alert(res.message, { icon: 1 });
        }else{
          layer.alert(res.message, { icon: 2 });
        }
       // layer.alert(res, { icon: 1 });
      }
    });
  },
  deletefiles (data) {
    $.ajax({
      url: 'http://localhost:28019/blog-api/v1/files/delete-files',
      type: "POST",
      dataType: "JSON",
      contentType: "application/json",  // 设置 contentType
      data: JSON.stringify(data),  // 将数据格式化为 JSON 字符串
      success: function (res) {
       // layer.alert(res, { icon: 1 });
      }
    });
  },
  deletefilesdedup (data) {
    $.ajax({
      url: 'http://localhost:28019/blog-api/v1/files/delete-files-dedup',
      type: "POST",
      dataType: "JSON",
      contentType: "application/json",  // 设置 contentType
      data: JSON.stringify(data),  // 将数据格式化为 JSON 字符串
      success: function (res) {
       // layer.alert(res, { icon: 1 });
      }
    });
  },
  mergefiles (data) {
    console.log('mergefiles====',JSON.stringify(data))
    $.ajax({
      url: 'http://localhost:28019/blog-api/v1/files/merge-files',
      type: "POST",
      dataType: "JSON",
      contentType: "application/json",  // 设置 contentType
      data: JSON.stringify(data),  // 将数据格式化为 JSON 字符串
      success: function (res) {
       // layer.alert(res, { icon: 1 });
      }
    });
  },
  mergefilesToEpub (data) {
    console.log('mergefilesToEpub====',JSON.stringify(data))
    $.ajax({
      url: 'http://localhost:28019/api/epub/generate',
      type: "POST",
      dataType: "JSON",
      contentType: "application/json",  // 设置 contentType
      data: JSON.stringify(data),  // 将数据格式化为 JSON 字符串
      success: function (res) {
       // layer.alert(res, { icon: 1 });
      }
    });
  },
  simpleCrawler2 (data) {
    const _this = this
    if(_this.simpleCrawlerTimeOut) clearTimeout(_this.simpleCrawlerTimeOut)
    if(_this.simpleCrawlerNum===0) _this.simpleCrawlerNum = 1
    else _this.simpleCrawlerNum ++
    if(_this.simpleCrawlerNum>190){
      _this.simpleCrawlerNum = 0
    }else{
      let data = {
        field_Path: 'https://www.bqg46.cc/html/82925/'+_this.simpleCrawlerNum+'.html'
      }
      _this.simpleCrawler(data)
      _this.simpleCrawlerTimeOut = setTimeout(()=>{
        _this.simpleCrawler2()
      },1000)
    }
  },


  // 获取指定目录下的所有图片，并在页面上显示
  showAllImages (data) {
    data.act = 'showAllImages';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {
        var d = data.split('|');
        console.log(d);
        var image = '';
        for (var i = 0; i < d.length; i++) {
          image += '<img src="' + d[i] + '" alt="">';
        }
        console.log(image);
        $(".images").html(image);
        // layer.alert(data, {icon: 1});
      }
    });
  },

  // 根据一个网页地址爬取网页信息
  onlinePaQu (data) {
    data.act = 'phppaqu';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {
        console.log(data);
        layer.alert(data, { icon: 1 });
      }
    });
  },
  //在表story中，根据小说名，生成txt文件
  hstoryCreateTxt (data) {
    data.act = 'hstoryCreateTxt';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {
        console.log('写入文件状态：' + data);
        // layer.alert(data, {icon: 1});
      }
    });
  },
  // 获取这个小说中已经写入txt的记录，用了判断是否生成txt完成
  hstoryCreateTxtnum (data, callback) {
    data.act = 'hstoryCreateTxtnum';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {

        let r = eval('(' + data + ')');
        let num = r[0]['num'];
        console.log('当前尚未写入txt数量：' + num);
        if (Number(num) === 0) {
          callback();
        }
        // layer.alert(data, {icon: 1});
      }
    });
  },
  //在表story中，根据小说名，删除数据
  hstoryDelete (data) {
    data.act = 'hstoryDelete';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {
        layer.alert(data, { icon: 1 });
      }
    });
  },
  //在表story中，根据小说名，获取小说内容
  hstorygetNr (data) {
    data.act = 'hstorygetNr';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {
        console.log('获取在线内容：' + data);
        // layer.alert(data, {icon: 1});
      }
    });
  },
  // 获取这个小说中为空的记录，用了判断是否爬取完成
  hstorygetNrNull (data, callback) {
    data.act = 'hstorygetNrNull';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {

        let r = eval('(' + data + ')');
        let num = r[0]['num'];
        console.log('当前尚未获取到内容数量：' + num);
        if (Number(num) === 0) {
          callback();
        }
        // layer.alert(data, {icon: 1});
      }
    });
  },
  // uniapp测试数据：获取新闻
  UNNIAPP_getOnlineNr (data, callback) {
    $.ajax({
      url: 'https://unidemo.dcloud.net.cn/api/news',
      type: "GET",
      dataType: "JSON",
      data: data,
      success: function (data) {
        callback(data);
      }
    });
  },
  // uniapp测试数据：保存新闻
  UNNIAPP_createNews (data) {
    data.act = 'UNNIAPP_createNews';
    $.ajax({
      url: ajaxFileDealPhp,
      type: "POST",
      dataType: "TEXT",
      data: data,
      success: function (data) {


      }
    });
  }
}
