let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: 'all',
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.dataType = options.type || 'all';
    this.setData({ dataType: this.data.dataType });
    var point_orderstate = 0;
    if(this.data.dataType == 'payment'){
      point_orderstate = 10;
    }else if(this.data.dataType == 'delivery'){
      point_orderstate = 20;
    }else if(this.data.dataType == 'received'){
      point_orderstate = 30;
    }else if(this.data.dataType == 'share'){
      point_orderstate = 20;
      this.setData({
        type: 2
      })
    }
    
    this.setData({
      point_orderstate: point_orderstate
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单列表
    this.getOrderList(this.data.dataType);
  },

  /**
   * 获取订单列表
   */
  getOrderList: function (dataType) {
    let _this = this;
    var p = {};
    if(_this.data.type && _this.data.type == 2){
      p = {member_id: wx.getStorageSync('uid'),point_orderstate: _this.data.point_orderstate,type:_this.data.type};
    }else{
      p = {member_id: wx.getStorageSync('uid'),point_orderstate: _this.data.point_orderstate};
    }
    App._get('Apis/orderList', p, function (result) {
      if (result.code === 0) {
        _this.setData({
          list:result.data
        });
        
        result.data.length && wx.pageScrollTo({
          scrollTop: 0
        });
      } else {
        _this.setData({
          list:[]
        });
      }
    });
  },

  /**
   * 切换标签
   */
  bindHeaderTap: function (e) {
    this.setData({ dataType: e.target.dataset.type });
    var point_orderstate = 0;
    if(this.data.dataType == 'payment'){
      point_orderstate = 10;
      this.setData({
        type: 1
      })
    }else if(this.data.dataType == 'delivery'){
      point_orderstate = 20;
      this.setData({
        type: 1
      })
    }else if(this.data.dataType == 'received'){
      point_orderstate = 30;
      this.setData({
        type: 1
      })
    }else if(this.data.dataType == 'share'){
      point_orderstate = 20;
      this.setData({
        type: 2
      })
    }
    this.setData({
      point_orderstate: point_orderstate
    })
    // 获取订单列表
    this.getOrderList(e.target.dataset.type);
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('Api/cancelOrder', {point_orderid: order_id }, function (result) {
            if (result.code === 0) {
              _this.getOrderList(_this.data.dataType);
            } else {
              App.showError(result.msg);
            }
          });
        }
      }
    });
  },

  /**
   * 确认收货
   */
  receipt: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('Api/receipt', {point_orderid: order_id }, function (result) {
            if (result.code === 0) {
              _this.getOrderList(_this.data.dataType);
            } else {
              App.showError(result.msg);
            }
          });
        }
      }
    });
  },

  /**
   * 发起付款
   */
  payOrder: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    var p = {
      openid: wx.getStorageSync('userInfo').member_wxopenid,
      member_id: wx.getStorageSync('uid'),
      buyer_name: wx.getStorageSync('userInfo').member_nickname,
      type:11,
      price: parseInt(e.currentTarget.dataset.price),
      goods_name: e.currentTarget.dataset.goods_name,
      goods_price: parseInt(e.currentTarget.dataset.price),
      goods_num: 1
    };
    App._post_form('Wxpays/pay', p, function (e) {
      // 发起微信支付
      wx.requestPayment(
        {
          'timeStamp': e.data.timeStamp,
          'nonceStr': e.data.nonceStr,
          'package': e.data.package,
          'signType': 'MD5',
          'paySign': e.data.sign,
          'success': function (res) {
            console.log(res);
          },
          'fail': function (res) { },
          'complete': function (res) {
            console.log('支付完成');
            console.log(res);
            if (res.errMsg == 'requestPayment:ok') {
              _this.orderState(order_id);
            }
            return;

          }
      })
    });
  },
  //修改订单状态
  orderState: function(order_id){
    var that = this;
    var p = {point_orderid: order_id};
    App._post_form('Apis/pointsorderState', p, function (res) {
      if(res.code == 0){
        wx.showModal({
          title: '提示',
          content: '支付成功',
          success: function(res){
            wx.redirectTo({
              url: '../order/detail?order_id=' + order_id,
            });
          }
        });
      }
    })
  },

  /**
   * 跳转订单详情页
   */
  detail: function (e) {
    let order_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order/detail?order_id=' + order_id + '&goods_id=' + e.currentTarget.dataset.goods_id
    });
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }


});