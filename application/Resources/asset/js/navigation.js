/*导航页js样式*/
$(function(){
  getdate();
  setInterval(function () {
    getdate();
  }, 1000 * 60)
})
function getdate(){
  var dvs = document.getElementById('dvs');
    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var ds = d.getDate();
    if (ds <= 9) {
      ds = '0' + ds;
    }
    var h = d.getHours();
    if (h <= 9) {
      h = '0' + h;
    }
    var f = d.getMinutes();
    if (f <= 9) {
      f = '0' + f;
    }
    var s = d.getSeconds();
    if (s <= 9) {
      s = '0' + s;
    }
    var days = d.getDay();
    switch (days) {
      case 1:
        days = '星期一';
        break;
      case 2:
        days = '星期二';
        break;
      case 3:
        days = '星期三';
        break;
      case 4:
        days = '星期四';
        break;
      case 5:
        days = '星期五';
        break;
      case 6:
        days = '星期六';
        break;
      case 0:
        days = '星期日';
        break;

    }

    let dad = y + '-' + m + '-' + ds + ' ' + h + ':' + f + ':' + s + ' ' + days;
    $("#datedom").html(dad);
}
