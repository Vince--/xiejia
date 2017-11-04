(function ($) {
  var cookie = getValue(document.cookie, 'token');
  var appkey = cookie ? md5('xiejia-admin_' + cookie) : '';

  var search = location.search.slice(1);
  var share_id = getValue(search, 'share_id');

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

  function getOrder(isGold, getOrderCallback) {
    var data = {
      goodsid: isGold ? 1 : 2,
      paytype: 1,
      appkey: appkey,
    };
    $.ajax({
      url: 'http://test.00981.net/xiejia/index.php?s=/Api/Order/pay',
      type: 'POST',
      data: data,
      success: function(res) {
        if (res.stateCode == 0) {
          getOrderCallback(res.data);
        } else {
          weui.alert(res.errorMsg);
        }
      },
      error: function(res) {
        weui.alert(res.errorMsg);
      }
    })
  }

  function onBridgeReady(data) {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        "appId": "wx2421b1c4370ec43b", //公众号名称，由商户传入     
        "timeStamp": "1395712654", //时间戳，自1970年以来的秒数     
        "nonceStr": "e61463f8efa94090b1f366cccfbbb444", //随机串     
        "package": "prepay_id=u802345jgfjsdfgsdg888",
        "signType": "MD5", //微信签名方式：     
        "paySign": "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
      },
      function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
      }
    );
  }
  
  // 点击购买
  var onClickBuy = function (isGold) {
    getOrder(isGold, function(data) {
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady(data), false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady(data));
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(data));
        }
      } else {
        onBridgeReady(data);
      }
    })

  }

  // 跳转注册
  $('.goto-register-container a').on('click', function() {
    location.href = share_id ? 'register.html' + '?share_id=' + share_id : 'register.html';
  })
  // 按钮绑定事件
  $('.gold-box .buy-btn').on('click', function () { onClickBuy(true) });
  $('.platinum-box .buy-btn').on('click', function () { onClickBuy(false) });

  // getAccessToken();
})(jQuery)