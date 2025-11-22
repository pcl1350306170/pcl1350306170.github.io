/**
 * 彼岸图网保存图片
 *
 * */
$(function () {

    let h = '<div style="width: 320px;height:60px;background-color: #63b504;text-align: center;line-height: 60px;color:#f8fff7;cursor: pointer;border-radius: 4px;margin-bottom: 10px;font-size: 19px;" id="pvlDown">开挂下载</div>'
    $(".downpic").before(h)

    document.cookie = 'PHPSESSID=0rnnfsuj634jj94fkcpd248cj5; Hm_lvt_526caf4e20c21f06a4e9209712d6a20e=1584669297,1584776426,1584777835,1584835762; zkhanlastsearchtime=1584835792; zkhanmlusername=%B4%F3%C1%FA%C3%A8%B2%BB%CA%C7%C8%E2%CD%E8%D7%D3; zkhanmluserid=2887272; zkhanmlgroupid=1; zkhanmlrnd=owtwiY48mQDDmvM9Ufsj; zkhanmlauth=e35050347ed5c13f6f4194a636b4d7cf; zkhanecookieclassrecord=%2C60%2C53%2C55%2C; Hm_lpvt_526caf4e20c21f06a4e9209712d6a20e=1584841605;path=/;';

    $("#pvlDown").click(function () {
        let id =  $(".downpic a").attr("data-id");

        $.ajax({
            type: "GET",
            url: "/e/extend/downpic.php",
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            data:{
                id:id,
                t:Math.random()
            },
            success: function(result) {
                alert(JSON.stringify(result));
            }
        });

        /*$.getJSON('/e/extend/downpic.php?id=' + id + '&t=' + Math.random(), function (data) {
            return
            data = {"msg": 4,"pic":"/downpic.php?id="+id+"&classid=57"}
            window.location.href = data.pic;
        });*/
    })
});

