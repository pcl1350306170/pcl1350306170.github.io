
$(function () {

    let URLL = window.location.href
    const PHP = 'http://localhost:80/blog/php/requestData_saveNovel.php'

    if(URLL.includes('freeradio')){
        let btn =          '<button type="button" class="el-button el-button--danger" style="position: fixed;left: 5vw;top:15vh;display: inline-block;line-height: 1;white-space: nowrap;cursor: pointer;-webkit-appearance: none;text-align: center;box-sizing: border-box;outline: none;margin: 0;transition: .1s;font-weight: 500;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;padding: 12px 20px;font-size: 18px;border-radius: 4px;color: #fff;background-color: #f56c6c;border-color: #f56c6c;"  id=\'ID_imgListbtn\' ><span>开始加载</span></button>';
        $("body").append(btn);

        // 列表展开:
        $("#ID_imgListbtn").click(function () {
            $(".fly-list").find('li').each(function () {
                let a = $(this).find("a").attr('href');

                console.log('aaaaaaaaaaaaaaa',a)
                window.open(a);
            })
            setTimeout(function () {
                $("#pages").find('a').each(function () {
                    let t = $(this).text()
                    console.log('t------',t)
                    if(t==='»'){
                        let a2= $(this).attr('href');
                        window.open(a2);
                    }
                })
                window.close();
            },1000*5)
        })

        setTimeout(function () {
            $("#ID_imgListbtn").click()
        },1000*3)
    }else{
        let src = $(".downloadURLL").find("audio").attr("src")
        console.log('src----',src)
        $.ajax({
            type: "POST",
            URLL: "http://localhost:80/mywww/php/requestOnline.php",
            data: {
                act: 'MUSICsave',
                src: src
            },
            success: function (data) {
                window.close();
            },
            error: function (data) {

            }
        });
    }
    

})


