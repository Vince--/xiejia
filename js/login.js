(function($) {
  var error = {
    phone: {
      1: '手机号不能为空',
      2: '手机号格式不正确',
      3: '手机号已存在，请直接登录'
    },
    password: {
      1: '登录密码不能为空',
      2: '密码最少为6位'
    }
  };
  var errorArr = [];

  function setRrrorInfo(type, index) {
    if (type && index) {
      $('.error-info').html(error[type][index]).show();
      errorArr.push(type + '_' + index);
    }
  }
  
  function removeErrorInfo() {
    $('.error-info').html('').hide();
  }

  function phoneBlur() {
    var reg = new RegExp('^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$');
    var value = $('.phone').val();
    if (!value) {
      setRrrorInfo('phone', 1);
    } else {
      if (!reg.test(value)) {
        setRrrorInfo('phone', 2);
      } else {
        removeErrorInfo();
      }
    }
  }

  function passwordBlur () {
    var value = $('.password').val();
    if (!value) {
      setRrrorInfo('password', 1);
    } else {
      if (value.length < 6) {
        setRrrorInfo('password', 2);
      } else {
        removeErrorInfo();
      }
    }
  }

  function onSubmitClick() {
    errorArr = [];
    phoneBlur()
    passwordBlur()
    if (errorArr.length > 0) {
      var type = errorArr[0].split('_')[0];
      var index = errorArr[0].split('_')[1];
      setRrrorInfo(type, index);
      return;
    } else {
      var phone = $('.phone').val(),
          password = $('.password').val();
      var data = {
        phonenum: phone,
        passwd: password
      };
      login(data)
    }
  }

  function login(data) {
    $.ajax({
      url: "http://47.95.37.187/checkreg",
      method: "POST",
      data: data
    })
    .done(function( res ) {
      if (res == 1) {
        location.href="/";
      } else {
        alert("登录失败");
      }
    })
    .fail(function(res) {
      alert("登录失败");
      console.log( "login Request failed: " + res );
    });
  }

  $('.phone').blur(function() { phoneBlur() })

  $('.password').blur(function() { passwordBlur() })

  $('.submit-btn').click(function() { onSubmitClick() })
})(jQuery)