let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: null,
    order: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_id = options.order_id;
    this.getOrderDetail(options.order_id,options.goods_id);
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function (order_id,goods_id) {
    let _this = this;
    App._get('Apis/order_detail', { order_id:order_id, goods_id:goods_id}, function (result) {
      if (result.code === 0) {
        console.log(result);
        _this.setData({
          order: result.data.order,
          address: result.data.address,
          goods: result.data.goods
        });
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 跳转到商品详情
   */
  goodsDetail: function (e) {
    let goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods/index?goods_id=' + goods_id
    });
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('Api/cancelOrder', {point_orderid: order_id }, function (result) {
            if (result.code === 0) {
              wx.navigateBack();
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
    let order_id = _this.data.order.point_orderid;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    var p = {
      openid: wx.getStorageSync('userInfo').member_wxopenid,
      member_id: wx.getStorageSync('uid'),
      buyer_name: wx.getStorageSync('userInfo').member_nickname,
      type:11,
      price: parseInt(_this.data.goods.price),
      goods_name: _this.data.goods.pgoods_name,
      goods_price: parseInt(_this.data.goods.price),
      goods_num: _this.data.order.buy_num
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
              that.orderState(order_id);
            }
            return;

          }
      })
    });
  },
  //修改订单状态
  orderState: function(order_id){
    var p = {point_orderid: order_id};
    App._post_form('Apis/pointsorderState', p, function (res) {
      if(res.code == 0){
        wx.showModal({
          title: '提示',
          content: '支付成功',
          success: function(res){
            if(res.confirm){
              wx.navigateBack();
            }
          }
        });
      }
    })
  },

  /**
   * 确认收货
   */
  receipt: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('Api/receipt', {point_orderid: order_id }, function (result) {
            if (result.code === 0) {
              _this.getOrderDetail(order_id);
            } else {
              App.showError(result.msg);
            }
          });
        }
      }
    });
  },


});