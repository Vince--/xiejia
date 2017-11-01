(function($) {
  $(document).ready(function() {
    $('.reimbursement-btn').on('click', function() {
      $.ajax({
        url: '',
        type: 'POST',
        data: {},
        success: function(res) {
          weui.alert('预约成功');
        },
        error: function(res) {
          weui.alert('预约失败');
        },
      })
    })
  })
})(jQuery)