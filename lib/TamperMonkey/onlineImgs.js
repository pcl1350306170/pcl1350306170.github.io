/**
 * 保存在线图片地址到数据库
 * 1、知乎
 *
 * */

/**
 * 猫咪视频操作
 * 网址：http://22maopp.com/
 *
 *
 * */

$(function () {
    var URL = window.location.href;

    let btn = "<span style='display: inline-block;position: fixed;left: 20px;top:20px;width: 150px;height: 60px;background-color: #fff700;font-size: 19px;padding: 15px;text-align: center;font-weight: bold;cursor: pointer;margin: 20px;' id='ID_imgListbtn'>保存图片</span>" +
        "";

    $("body").append(btn);
    let isclick = 0;

    // 图片列表展开:
    $("#ID_imgListbtn").click(function () {
        let srcs = []
        $("body").find("img").each(function () {
            let src = $(this).attr("data-actualsrc")
            if(src){
                srcs.push(src)
                $(this).remove()
            }
        })
        console.log(srcs)
        $.ajax({
            type: "POST",
            url: "http://localhost:80/mywww/php/requestOnline.php",
            data: {
                act: 'saveOnlineimg',
                srcs: srcs.join(",")
            },
            success: function (data) {

            },
            error: function (data) {

            }
        });
    })

})

