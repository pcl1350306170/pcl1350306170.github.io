var baseElement= {
  init(type){
    layui.use('element', function () {
      $ = layui.jquery;
      var element = layui.element;

      $('.layui-tab-title li').eq(0).find('i').remove();

      if(type && type == 'upnew') {
        element.init();
        return;
      }

      // //使iframe内容撑开视口
      height = $('.layui-layout-admin .site-demo').height();
      $('.layui-layout-admin .site-demo').height(height - 70);

      //监听导航点击
      element.on('nav', function (elem) {
        url = elem.find('a').attr('_href');
        $('.s-iframe').attr('src', url);

        return;
        title = elem.find('cite').text();
        if (title == '') return;

        url = elem.find('a').attr('_href');
        if (!url) return

        for (var i = 0; i < $('.s-iframe').length; i++) {
          console.log($('.s-iframe').eq(i).attr('src'), url, 1)
          if ($('.s-iframe').eq(i).attr('src') == url) {
            element.tabChange('s-tab', i);
            return;
          }
        }

        res = element.tabAdd('s-tab', {
          title: title//用于演示
          , content: '<iframe frameborder="0" src="' + url + '" class="s-iframe"></iframe>'
          , id: $('.layui-tab-title li').length
        });


        element.tabChange('s-tab', $('.layui-tab-title li').length - 1);

        $('.layui-tab-title li').eq(0).find('i').remove();

      });

    });
  }
}

