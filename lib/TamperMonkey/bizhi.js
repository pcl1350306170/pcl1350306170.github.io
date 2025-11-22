//保存已下载壁纸
//彼岸图网 http://pic.netbian.com/
//千叶网 http://qianye88.com/
//
function randomKeys (len) {
  var ab = '1234567890',
    keys = '';

  for (var i = 0; i < len; ++i) {
    keys += ab.substr(Math.floor((Math.random() * 10)), 1);
  }

  return keys;
}
$(function () {
  let URLL = window.location.href;
  const PHP = 'http://127.0.0.1:89/blog/php/requestData_bizhi.php';
  let hasSave = [];
  console.log(URLL);
  if (URLL.indexOf('netbian') > -1) {
    //彼岸图网的
    $.ajax({
      type: "POST",
      URLL: PHP,
      data: {
        act: 'getSaves',
        search_from: 'netbian'
      },
      success: function (data) {
        hasSave = eval('(' + data + ')');

        $(".clearfix li").each(function () {
          let a = $(this).find('a');
          let h = a.attr('href');

          let has = hasSave.findIndex(function (value, index) {
            return value.imgs === h;
          });
          console.log(has);
          let btn = '';
          if (has === -1) {
            btn = '<div style="width:100px;height: 50px;text-align: center;line-height: 50px;color: #0C0C0C;background: #ffffff;position: absolute;left:10px;top:10px;font-weight: bolder;border-radius: 10px;" imgcon = \'' + h + '\' class="btnBz">点击标记</div>';
          } else {
            btn = '<div style="width:95%;height: 90%;text-align: center;line-height: 50px;color: #fb594f;background: #6590ff;position: absolute;left:10px;top:10px;font-size: 3rem;font-weight: bolder;border-radius: 10px;">已下载</div>';
          }
          a.append(btn);
        });


        $(".clearfix li").find('.btnBz').click(function () {
          let _this = this;
          let imgcon = $(this).attr('imgcon');

          $.ajax({
            type: "POST",
            URLL: PHP,
            data: {
              act: 'add',
              field_imgs: imgcon,
              field_from: 'netbian'
            },
            success: function (data) {
              let btn2 = '<div style="width:95%;height: 90%;text-align: center;line-height: 50px;color: #fb594f;background: #6590ff;position: absolute;left:10px;top:10px;font-size: 3rem;font-weight: bolder;border-radius: 10px;">已下载</div>';
              console.log($(_this).parent());
              $(_this).parent().append(btn2);
              $(_this).parent().css({ 'opacity': '0.2' });
              $(_this).parent().find('.btnBz').remove();

            },
            error: function (data) {

            }
          });
        });
      },
      error: function (data) {

      }
    });

  } else if (URLL.indexOf('wall') > -1) {
    // https://wall.alphacoders.com/
    let button = '<button type="button" style="color:#fff;background-color:#67c23a;border-color:#67c23a;border-radius:20px;padding:12px 23px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;transition:.1s;font-weight:500;font-size:17px;position: absolute;top:17vh;left: 2vw;    border: 0;" id="ID_BTNdownLoadPdf" ><span>开始执行</span></button>';

    $("body").append(button);

    $("#ID_BTNdownLoadPdf").click(function () {
      let H = [];
      $('.thumb-container-big').each(function () {

        let src = $(this).find('.img-responsive').attr('src');
        let s1 = src.split('/');
        let num = s1[4].replace('thumbbig-', '').split('.');
        let http = 'https://initiate.alphacoders.com/download/wallpaper/' + num[0] + '/' + s1[2].replace('.alphacoders.com', '') + '/' + num[1] + '/' + randomKeys(8);
        console.log(http);
        H.push(http);
      });
      $.ajax({
        type: "POST",
        URLL: PHP,
        data: {
          act: 'addInitiate',
          field_imgs: H.join('\n'),
          field_from: 'initiate'
        },
        success: function (data) {
          console.log(data);
          if (data === 'ok') {
           // window.location = $("#next_page").attr("href");
          }
        },
        error: function (data) {

        }
      });
    });
    setTimeout(function () {
      //$("#ID_BTNdownLoadPdf").click();
    }, 1000);
  } else {
    //千叶网的
    $.ajax({
      type: "POST",
      URLL: PHP,
      data: {
        act: 'getSaves',
        search_from: 'qianye'
      },
      success: function (data) {
        hasSave = eval('(' + data + ')');

        $(".flex-images .item").each(function () {
          let a = $(this).find('a');
          let h = a.attr('href');

          let has = hasSave.findIndex(function (value, index) {
            return value.imgs === h;
          });
          console.log(has, h);
          let btn = '';
          if (has === -1) {
            btn = '<div style="width:100px;height: 50px;text-align: center;line-height: 50px;color: #0C0C0C;background: #ffffff;position: absolute;left:10px;top:10px;font-weight: bolder;border-radius: 10px;" imgcon = \'' + h + '\' class="btnBz">点击标记</div>';
          } else {
            btn = '<div style="width:95%;height: 90%;text-align: center;line-height: 50px;color: #fb594f;background: #6590ff;position: absolute;left:10px;top:10px;font-size: 3rem;font-weight: bolder;border-radius: 10px;">已下载</div>';
          }
          a.append(btn);
        });


        $(".flex-images .item").find('.btnBz').click(function () {
          let _this = this;
          let imgcon = $(this).attr('imgcon');

          $.ajax({
            type: "POST",
            URLL: PHP,
            data: {
              act: 'add',
              field_imgs: imgcon,
              field_from: 'qianye'
            },
            success: function (data) {
              let btn2 = '<div style="width:95%;height: 90%;text-align: center;line-height: 50px;color: #fb594f;background: #6590ff;position: absolute;left:10px;top:10px;font-size: 3rem;font-weight: bolder;border-radius: 10px;">已下载</div>';
              console.log($(_this).parent());
              $(_this).parent().append(btn2);
              $(_this).parent().css({ 'opacity': '0.2' });
              $(_this).parent().find('.btnBz').remove();

            },
            error: function (data) {

            }
          });
        });
      },
      error: function (data) {

      }
    });
  }
});



