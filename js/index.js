(function($) {
  var error = {
    phone: {
      1: '手机号不能为空',
      2: '手机号格式不正确',
      3: '手机号已存在，请直接登录'
    },
    security: {
      1: '验证码不能为空'
    },
    password: {
      1: '登录密码不能为空',
      2: '确认密码不能为空',
      3: '两次密码不一致，请重新输入',
      4: '密码最少为6位'
    }
  };
  var errorArr = [];
  var securityDisabled = true;
  var totalCount = 10;   
  var btnValid = true;

  function setRrrorInfo(type, index) {
    if (type && index) {
      $('.error-info').html(error[type][index]).show();
      errorArr.push(type + '_' + index);
    }
  }
  
  function removeErrorInfo() {
    $('.error-info').html('').hide();
  }

  function checkPhone(value) {
    var newValue = value || $('.phone').val();
    return $.ajax({
      url: 'http://47.95.37.187/checkphone',
      data: { phonenum: newValue },
    })
    .done(function(res) {
      new Promise(function(resolve, reject) {
        if (res == 'False') {
          setRrrorInfo('phone', 3);
          securityDisabled = true;
          btnValid = true;
          resolve();
        } else {
          securityDisabled = false;
          resolve();
        }
      })
    })
    .fail(function(res) {
      console.log( "checkPhone Request failed: " + res );
    });
  }

  function phoneBlur(type) {
    var reg = new RegExp('^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$');
    var value = $('.phone').val();
    if (!value) {
      setRrrorInfo('phone', 1);
    } else {
      if (!reg.test(value)) {
        setRrrorInfo('phone', 2);
      } else {
        removeErrorInfo();
        !type && checkPhone(value);
      }
    }
  }

  function securityBlur() {
    var value = $('.security-input').val();
    if (!value) {
      setRrrorInfo('security', 1);
    } else {
      removeErrorInfo();
    }
  }

  function passwordBlur () {
    var value = $('.password').val();
    if (!value) {
      setRrrorInfo('password', 1);
    } else {
      if (value.length < 6) {
        setRrrorInfo('password', 4);
      } else {
        var confirmPassword = $('.confirm-password').val();
        if (confirmPassword && confirmPassword != value) {
          setRrrorInfo('password', 3);
        } else {
          removeErrorInfo();
        }
      }
    }
  }

  function confirmPasswordBlur() {
    var value = $('.confirm-password').val();
    if (!value) {
      setRrrorInfo('password', 2);
    } else {
      if (value.length < 6) {
        setRrrorInfo('password', 4);
      } else {
        var password = $('.password').val();
        if (password && password != value) {
          setRrrorInfo('password', 3);
        } else {
          removeErrorInfo()
        }
      }
    }
  }

  function setCountDown() {
    setTime();
    function setTime() {
      if (totalCount < 0) {
        $('.security-code').html('发送验证码');
        totalCount = 10;
        btnValid = true;
      } else {
        btnValid = false;
        $('.security-code').html('重新发送( ' + totalCount +'s )');
        totalCount--;
        setTimeout(function() {setTime()}, 1000)
      }
    }
  }
  
  function getSecurityCode() {
    btnValid = false;
    checkPhone().then(
      res => {
        if (securityDisabled) return;
        var value = $('.phone').val();
        $.ajax({
          url: 'http://47.95.37.187/sendmessage',
          method: 'POST',
          data: { phonenum: value },
        })
        .done(function(res) {
          if (res == 1) setCountDown()
        })
        .fail(function(res) {
          console.log( "getSecurityCode Request failed: " + res );
        });
      }
    )
  }
  
  function register(data) {
    $.ajax({
      url: "http://47.95.37.187/checkreg",
      method: "POST",
      data: data
    })
    .done(function( res ) {
      if (res == 1) {
        location.href="/";
      } else {
        alert("注册失败");
      }
    })
    .fail(function(res) {
      alert("注册失败");
      console.log( "register Request failed: " + res );
    });
  }
  
  function onSubmitClick() {
    errorArr = [];
    phoneBlur(true)
    securityBlur()
    passwordBlur()
    confirmPasswordBlur()
    if (errorArr.length > 0) {
      var type = errorArr[0].split('_')[0];
      var index = errorArr[0].split('_')[1];
      setRrrorInfo(type, index);
      return;
    } else {
      var phone = $('.phone').val(),
      vcode = $('.security-input').val(),
      password = $('.password').val(),
      uname = $('.uname').val(),
      inviteCode = $('.invite_code').val();
      var data = {
        phonenum: phone,
        vcode: vcode,
        passwd: password
      };
      uname && (data.uname = uname);
      inviteCode && (data.inviteCode = inviteCode);
      register(data)
    }
  }

  $('.phone').blur(function() { phoneBlur() })

  $('.security-input').blur(function() { securityBlur() })

  $('.password').blur(function() { passwordBlur() })

  $('.confirm-password').blur(function() { confirmPasswordBlur() })

  $('.security-code').click( function() { btnValid && getSecurityCode() })

  $('.submit-btn').click(function() { onSubmitClick() })
})(jQuery)