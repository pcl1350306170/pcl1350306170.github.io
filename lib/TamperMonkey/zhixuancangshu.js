$(function () {
    setTimeout(function () {
        let t = $(".pagefujian .down_2").find('a').attr('href');

        if(t !== '' && t){
            window.open(t);
            setTimeout(()=>{
                window.close();
            },1000*3)
        }

        let d = $(".downfile").eq(0).find('a').attr('href');


        if(d && d !== ''){
            let texa = '<textarea style="width:800px;height:100px;position:fixed;z-index:999999;top:50px;left:100px;" id="ID_TEXTA"></textarea>';

            $("body").append(texa)
            $("#ID_TEXTA").val(d)

            $("#ID_TEXTA").select()
            document.execCommand("Copy"); // 执行浏览器复制命令

            setTimeout(()=>{
                window.close();
            },1000*3)
        }
    }, 1000)
})
