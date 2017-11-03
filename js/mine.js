(function($) {
  $(document).ready(function() {
    var appkey = '';
    var courseFlag = false;
    var withdrawFlag = false;
    var payType = 1;
    var address = [];
    var total = 234;
    var base = {
      username: '',
      headIcon: '',
      level: '',
      level_start: '',
      level_exprie: '',
    };

    function init() {
      getAppKey(function() { getUserInfo() })
    }
    //获取 APPKEY
    function getAppKey(getAppKeyCallback) {
      var cookie = getValue(document.cookie, 'token');
      console.log('cookie ', cookie);
      appkey = cookie ? md5('xiejia-admin_' + cookie) : '';    
      getAppKeyCallback();
    }
    function getValue(str, c_name) {
      if (str.length > 0) {
        start = str.indexOf(c_name + "=")
        if (start != -1) { 
          start = start + c_name.length+1 
          end = str.indexOf(";", start)
          if (end == -1) end = str.length;
          return str.substring(start,end)
        } 
      }
      return ""
    }
    // 获取用户信息
    function getUserInfo() {
      $.ajax({
        url: 'http://test.00981.net/xiejia/index.php?s=/Api/User/userinfo',
        data: { appkey: appkey },
        success: function(res) {
          if (res.stateCode == 0 && res.data) {
            $('#loadingToast').hide();
            backfillUserInfo(res.data)
          } else {
            weui.alert(res.errorMsg);
          }
        },
        error: function(res) {
          weui.alert(res.errorMsg);
        }
      })
    }
    //数据回填
    function backfillUserInfo(data) {
      base.username = data.username;
      base.headIcon = data.headIcon;
      base.level = data.level;
      base.level_start = data.level_start;
      base.level_exprie = data.level_exprie;

      $('.face img').attr('src', data.headIcon);
      $('.username').html(data.username);
      setLevel(data.level);
      setTime(data);
    }
    // 设置时间
    function setTime(data) {
      if (data.level_start && data.level_start != 0) {
        var time = new Date(data.level_start * 1000);
        var date = formatDate(time);
        $('.level-start').html(date)
      }
      if (data.level_exprie && data.level_exprie != 0) {
        var time = new Date(data.level_exprie * 1000);        
        var date = formatDate(time);
        $('.level-exprie').html(date)
      }
    }
    // 格式化时间戳
    function formatDate(time)   {     
      var year=time.getFullYear();     
      var month=time.getMonth()+1;     
      var date=time.getDate();     
      var hour=time.getHours();     
      var minute=time.getMinutes();     
      var second=time.getSeconds();     
      return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;     
    } 
    // 获取会员等级
    function setLevel(level) {
      var levelName = '';
      if (level == 1) levelName = '黄金会员';
      if (level == 2) {
        levelName = '白金会员';
        $('.member').addClass('platinum-member');
      }
      if (!level) levelName = '普通会员';
      $('.member').html(levelName);
    }

    // 点击课程
    $('.course-header').on('click', function() {
      $('.course').slideToggle(); 
      courseFlag = !courseFlag;
      if (courseFlag) {
        $('.course-header .right-icon').removeClass('fa-caret-down').addClass('fa-caret-up');     
      } else {
        $('.course-header .right-icon').removeClass('fa-caret-up').addClass('fa-caret-down');     
      }
    })

    // 添加收货地址
    $('.shipping-address-header').on('click', function() {
      $('.shipping-address').slideToggle();
      $('.shipping-error-container').css('display', 'none');
      $('.shipping-error').val();
      $('.shipping-address .weui-input, .shipping-address .weui-textarea').val('');
      $('.region-content').html('请选择');
      address = [];
    })
    // 级联picker
    $('.region').on('click', function() {
      weui.picker(pickerData, {
        depth: 3,
        className: 'custom-classname',
        container: 'body',
        defaultValue: [],
        onConfirm: function (result) {
          var html = '';
          for(var i=0; i<result.length; i++) {
            html += result[i].label;
            address.push(result[i].value);
          }
          $('.region-content').html(html);
          var errorVal = $('.shipping-error').html();
          console.log('errorVal ', errorVal)
          if (errorVal == '所在地区必填') {
            $('.shipping-error-container').css('display', 'none');
            $('.shipping-error').val();
          }
        },
      });
    })
    // 点击收货地址保存按钮
    $('.shipping-btn').on('click', function() {
      name = $('.shipping-name').val();
      if (!name) {
        $('.shipping-error-container').css('display', 'flex');
        $('.shipping-error').html('收货人必填');
        return;
      }

      phone = $('.shipping-phone').val();
      if (!phone) {
        $('.shipping-error-container').css('display', 'flex');
        $('.shipping-error').html('联系电话必填');
        return;
      }

      if (address.length <= 0) {
        $('.shipping-error-container').css('display', 'flex');
        $('.shipping-error').html('所在地区必填');
        return;
      }

      addr = $('.shipping-addr').val();
      if (!addr) {
        $('.shipping-error-container').css('display', 'flex');
        $('.shipping-error').html('详细地址必填');
        return;
      }

      var data = {
        name: name,
        phone: phone,
        address: address,
        addr: addr,
      };

      $.ajax({
        url: '',
        type: 'POST',
        data: data,
        success: function(res) {
          weui.alert('保存成功');
        },
        error: function(res) {
          console.log("res ", res);
          weui.alert('保存失败');
          $('.shipping-icon').removeClass('fa-plus').addClass('fa-pencil-square-o')
          $('.shipping-btn').html('编辑');
          $('.shipping-address').hide();
        }
      })
    })
    // 输入框
    $('.shipping-address .weui-input, .shipping-address .weui-textarea').on('input', function() {
      $('.shipping-error-container').css('display', 'none');
      $('.shipping-error').val();
    })
    // 点击线下已取货
    $('.offline-btn').on('click', function() {
      $.ajax({
        url: '',
        type: 'POST',
        data: '',
        success: function(res) {
          weui.alert('提交成功');
        },
        error: function(res) {
          weui.alert('提交失败');
        },
      })
    })


    // 点击提现
    $('.withdraw-header').on('click', function() {
      $('.withdraw-content').slideToggle();
      $('.withdraw-content .withdraw-input').val('');
      $('.withdraw-error-container').hide();
      withdrawFlag = !withdrawFlag;
      if (withdrawFlag) {
        $('.withdraw-header .right-icon').removeClass('fa-caret-down').addClass('fa-caret-up');     
      } else {
        $('.withdraw-header .right-icon').removeClass('fa-caret-up').addClass('fa-caret-down');     
      }
    })
    // 选择提现方式
    $('.withdraw-content .weui-check').on('change', function() {
      payType = $(this).val();
      $('.withdraw-input').val('');
      $('.withdraw-error-container').css('display', 'none');
      if (payType == '1') {
        $('.withdraw-user-container').hide();
      } else {
        $('.withdraw-user-container').show();
      }
    })
    // 输入框
    $('.withdraw-content .withdraw-input').on('input', function() {
      $('.withdraw-error-container').css('display', 'none');
    })
    // 点击全部提现
    $('.withdraw-all-amount').on('click', function() {
      $('.withdraw-amount').val(total);
      var error = $('.withdraw-error').html();
      if (error == '提现金额不能为空' || error == '提现金额需大于0元') {
        $('.withdraw-error-container').hide();
      }
    })
    // 判断输入金额
    $('.withdraw-amount').on('blur', function() {
      var val = $(this).val();
      if (val > total) {
        $(this).val('');
        $('.withdraw-error-container').css('display', 'flex');
        $('.withdraw-error').html('提现金额不能大于总金额');
      }
    })
    // 点击提现 保存 按钮
    $('.withdraw-btn').on('click', function() {
      // 支付宝
      if (payType && payType == '2') {
        var name = $('.withdraw-name').val();
        var account = $('.withdraw-account').val();
        if (!name) {
          $('.withdraw-error-container').css('display', 'flex');
          $('.withdraw-error').html('真实姓名不能为空');
          return;
        }
        if (!account) {
          $('.withdraw-error-container').css('display', 'flex');
          $('.withdraw-error').html('支付宝账号不能为空');
          return;
        }
        payName = name;
        payAccount = account;
      }
      // 银行卡
      if (payType && payType == '3') {
        var name = $('.withdraw-name').val();
        var account = $('.withdraw-account').val();
        if (!name) {
          $('.withdraw-error-container').css('display', 'flex');
          $('.withdraw-error').html('真实姓名不能为空');
          return;
        }
        if (!account) {
          $('.withdraw-error-container').css('display', 'flex');
          $('.withdraw-error').html('银行账号不能为空');
          return;
        }
        payName = name;
        payAccount = account;
      }
      // 提现金额
      var amount = $('.withdraw-amount').val();
      if (!amount) {
        $('.withdraw-error-container').css('display', 'flex');
        $('.withdraw-error').html('提现金额不能为空');
        return;
      }
      if (amount && amount == 0) {
        $('.withdraw-error-container').css('display', 'flex');
        $('.withdraw-error').html('提现金额需大于0元');
        return;
      }

      var data = {};
      data.payType = payType;
      data.amount = amount;
      if (payType && payType != '1') data.payAccount = payAccount;

      $.ajax({
        url: '',
        type: 'POST',
        data: data,
        success: function(res) {
          weui.alert('保存成功');
        },
        error: function(res) {
          console.log("res ", res);
          weui.alert('保存失败');
          $('.withdraw-amount').val('');
          total = total - amount;
          $('.total').html(total);
          $('.withdraw-content').hide();
        }
      })
    })

    init();
  })
})(jQuery)