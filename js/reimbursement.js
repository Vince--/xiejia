(function($) {
  $(document).ready(function() {
    var appkey = '';
    getAppKey();
    //获取 APPKEY
    function getAppKey() {
      var cookie = getValue(document.cookie, 'token');
      appkey = cookie ? md5('xiejia-admin_' + cookie) : '';    
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

    $('.reimbursement-btn').on('click', function() {
      $.ajax({
        url: 'http://test.00981.net/xiejia/index.php?s=/Api/',
        type: 'POST',
        data: { appkey: appkey },
        success: function(res) {
          if (res.stateCode == 0) {
            weui.alert('预约成功');
          } else {
            weui.alert(res.errorMsg);
          }
        },
        error: function(res) {
          weui.alert('预约失败');
        },
      })
    })
  })
})(jQuery)