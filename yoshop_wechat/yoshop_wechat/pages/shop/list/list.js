let App = getApp();
Page({
  data: {
    current:0
  },
  swichNav: function(e){
    var that = this;
    that.setData({
      current: e.currentTarget.dataset.current
    })
    that.prod_list();
  },
  onLoad: function(){
    this.prod_list();
  },
  prod_list: function(){
    var that = this;
    App._post_form('Apis/prod_list', {shop_id: wx.getStorageSync('userInfo').shop_id,pgoods_state: that.data.current}, function (e) {
      console.log(e);
      if(e.code == 0){
        that.setData({
          prod_list: e.data
        })
      }
    })
  },
  is_show: function(e){
    var that = this;
    App._post_form('Apis/is_show', {pgoods_id: e.currentTarget.dataset.pgoods_id,pgoods_show: e.currentTarget.dataset.pgoods_show}, function (e) {
      if(e.code == 0){
        App.showSuccess('修改成功');
        that.prod_list();
      }
    })
  },
  del: function(e){
    var that = this;
    wx.showModal({
      title: "提示",
      content: "确认删除商品？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('Apis/del_goods', {pgoods_id: e.currentTarget.dataset.pgoods_id}, function (e) {
            if(e.code == 0){
              App.showSuccess('删除成功');
              that.prod_list();
            }
          })
        }
      }
    });
    
  }
})