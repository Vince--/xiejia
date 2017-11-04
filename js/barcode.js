(function($) {
  $(document).ready(function() { 
    // 初始化
    function init() {
      getAppKey(function() {
        getBarcode();
      })
    }
    //获取 APPKEY
    function getAppKey(getAppKeyCallback) {
      var cookie = getValue(document.cookie, 'token');
      appkey = cookie ? md5('xiejia-admin_' + cookie) : '';    
      getAppKeyCallback();
    }
    //
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
    // 获取二维码
    function getBarcode() {
      $.ajax({
        url: 'http://test.00981.net/xiejia/index.php?s=/Api/User/sCode',
        data: { appkey: appkey },
        success: function(res) {
          console.log(res)
          var base64img=decodeURI(res)
          console.log(base64img)
          $('.barcode-container img').attr('src', 'data:image/png;base64,' + base64img)
        },
        error: function(res) {
          weui.alert('获取二维码失败');
        }
      })
    }

    init();
  })
})(jQuery)