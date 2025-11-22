$(function(){
  dealcodea();
  // 验证码
  $("#loginkeyVal").blur(function () {
    let v = $(this).val();
    $(".varify-input-code").val(v);
  })
  $('#loginKeydom').codeVerify({
    type: 1,
    width: '',
    height: '40px',
    fontSize: '28px',
    codeLength: 4,
    btnId: 'loginBtn',
    ready: function () {
    },
    success: function () {
      ckeckLogin();
    },
    error: function () {
      alert('验证码不匹配！');
      $("#loginkeyVal").val('');
      $("#loginkeyVal").focus();
    }
  });
})
function ckeckLogin(){
  let username = $("#username").val();
  let password = $("#password").val();
  if(username == '' || password==''){
    alert("用户名或密码不能为空！");
    return;
  }
  $.ajax({
    type: "POST",
    url: "./php/login.php",
    data: {
      act: "login",
      username: username,
      password: password
    },
    success: function (data) {
      if(data=='yes'){
        window.location = 'navigationPage.html'
      }
    },
    error: function (data) {

    }
  });
}

function dealcodea() {

  for (let i = 0; i < 30; i++) {
    let sjs = GetRandomNum(-80, 180)
    let sjs2 = GetRandomNum(1, 10)
    let h = `<div class="dom-sourcecode" style="right: ${i * 30}px;top: ${sjs}px;height: ${400 + sjs}px">
                    <div class="sourcecode" style="opacity:${sjs2 * 0.1};">
                        1010111001101011100110110111001100101011010100010101010110001101101010101110011010111001101101110011001010110101
                    </div>
              </div>`
    $("body").append(h)
  }
}

function GetRandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}
