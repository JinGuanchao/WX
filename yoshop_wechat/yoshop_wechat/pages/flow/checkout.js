let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false, // 快捷导航
    options: {}, // 当前页面参数

    address: null, // 默认收货地址
    exist_address: false, // 是否存在收货地址
    goods: {}, // 商品信息

    disabled: false,

    hasError: false,
    error: '',
    remarks: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 当前页面参数
    this.setData({
      options: options
    })
    if(options.spell_id){
      this.setData({
        order_total_price: options.price
      })
    }
  },
  getInputValue:function(e){
    console.log(e.detail.value);
    console.log(e.currentTarget.dataset.index);
    var that = this;
    var remarks = that.data.remarks;
    remarks[e.currentTarget.dataset.index] = e.detail.value;
    that.setData({
      remarks: remarks
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    // 获取当前订单信息
    this.getOrderData();
    
  },
  /**
   * 选择配送地址
   */
  address: function(){
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(res);
        that.setData({
          address: res
        })
      }
    })
  },

  /**
   * 获取当前订单信息
   */
  getOrderData: function() {
    let _this = this,
      options = _this.data.options;

    // 获取订单信息回调方法
    // let callback = function(result) {
    //   if (result.code !== 1) {
    //     App.showError(result.msg);
    //     return false;
    //   }

    //   收货地址不在配送范围内
    //   if (result.data.address !== null && !result.data.intra_region) {
    //     _this.data.hasError = true;
    //     _this.data.error = result.data.intra_region_error;
    //     App.showError(_this.data.error);
    //   }
    //   console.log(result.data.data);
    //   _this.setData({
    //     goods_list: result.data
    //   });
    // };

    // 立即购买
    if (options.order_type === 'buyNow') {
      App._get('Apis/buyNow', {
        goods_id: options.goods_id,
        goods_num: options.goods_num
      }, function(result) {
        var goods_list = result.data;
        goods_list[0]['pgoods_num'] = options.goods_num;
        var limit_price = result.data[0].limit_price * _this.data.options.goods_num;
        var member_token = wx.getStorageSync('userInfo').member_token;
        if(member_token > limit_price){
          var token = limit_price;
        }else{
          var token = member_token;
        }
        // if(options.coupon){
        //   var price = result.data[0].price * _this.data.options.goods_num - options.coupon;
        // }else{
        //   var price = result.data[0].price * _this.data.options.goods_num;
        // }
        var price = result.data[0].price * _this.data.options.goods_num - token;
        if(!_this.data.options.spell_id){
          _this.setData({
            order_total_price: price,
          })
        }
        _this.setData({
          goods_list: goods_list,
          pgoods_num: options.goods_num,
          total: result.data[0].price * _this.data.options.goods_num,
          limit_price: limit_price,
          token: token
        });
        // callback(result);
      });
    }

    // 购物车结算
    else if (options.order_type === 'cart') {
      App._get('Apis/cart_lists', {member_id:wx.getStorageSync('uid')}, function(result) {
        var limit_price = 0;
        for(var i=0;i<result.data.length;i++){
          limit_price += result.data[i].limit_price * result.data[i].pgoods_num
        }

        var member_token = wx.getStorageSync('userInfo').member_token;
        if(member_token > limit_price){
          var token = limit_price;
        }else{
          var token = member_token;
        }
        var price = result.total - token;
        // if(options.coupon){
        //   var price = result.total - options.coupon;
        // }else{
        //   var price = result.total;
        // }
        _this.setData({
          goods_list: result.data,
          order_total_price: price,
          pgoods_num: result.pgoods_num,
          total: result.total,
          limit_price: limit_price,
          token: token
        });
        // callback(result);
      });
    }

  },

  /**
   * 订单提交
   */
  submitOrder: function() {
    let _this = this,
      options = _this.data.options;

    if (_this.data.disabled) {
      return false;
    }

    if (_this.data.hasError) {
      App.showError(_this.data.error);
      return false;
    }

    if(!_this.data.address){
      App.showError('请选择收货地址');
      return false;
    }

    // 按钮禁用, 防止二次提交
    _this.data.disabled = true;

    // 显示loading
    wx.showLoading({
      title: '正在处理...'
    });
    var remarks = '';
    if(_this.data.remarks.length>0){
      for(var i=0;i<_this.data.remarks.length;i++){
        remarks+=_this.data.remarks[i] + ',';
      }
    }
    // 创建订单-立即购买
    if (options.order_type === 'buyNow') {
      var address = _this.data.address;
      // if(options.str){
      //   var str = options.str
      // }else{
      //   var str = null;
      // }
      if(options.spell_id){
        var p = {
          goods_id: options.goods_id,
          shop_id: _this.data.goods_list[0].shop_id,
          goods_num: options.goods_num,
          member_id:wx.getStorageSync('uid'),
          point_price: _this.data.order_total_price,
          pointoa_truename: address.userName, 
          pointoa_areainfo: address.provinceName + address.cityName + address.countyName + address.nationalCode, pointoa_address: address.detailInfo, 
          pointoa_zipcode: address.postalCode, 
          pointoa_mobphone: address.telNumber,
          type: options.type,
          spell_id: options.spell_id,
          tokens: 0,
          remarks: remarks
        };
      }else{
        var p = {
          goods_id: options.goods_id,
          shop_id: _this.data.goods_list[0].shop_id,
          goods_num: options.goods_num,
          member_id:wx.getStorageSync('uid'),
          point_price: _this.data.order_total_price,
          pointoa_truename: address.userName, 
          pointoa_areainfo: address.provinceName + address.cityName + address.countyName + address.nationalCode, pointoa_address: address.detailInfo, 
          pointoa_zipcode: address.postalCode, 
          pointoa_mobphone: address.telNumber,
          type: options.type,
          tokens: _this.data.token,
          remarks: remarks
        };
      }
      
      App._post_form('Apis/buy_now', p, function(result) {
        // success
        // _this.orderState(result.data);
        _this.wxpay(result.data);
      }, function(result) {
        // fail
        console.log('fail');
      }, function() {
        // complete
        console.log('complete');
        // 解除按钮禁用
        _this.data.disabled = false;
      });
    }

    // 创建订单-购物车结算
    else if (options.order_type === 'cart') {
      var address = _this.data.address;
      // console.log(address);return;
      App._post_form('Apis/settlement', {member_id:wx.getStorageSync('uid'),pointoa_truename: address.userName, pointoa_areainfo: address.provinceName + address.cityName + address.countyName + address.nationalCode, pointoa_address: address.detailInfo, pointoa_zipcode: address.postalCode, pointoa_mobphone: address.telNumber,remarks:remarks}, function(result) {
        var orderids = '';
        for(var i=0;i<result.length;i++){
          orderids+=result[i] + ',';
        }
        _this.setData({
          orderids: orderids
        })
        _this.wxpay();
      }, function(result) {
        // fail
        console.log('fail');
      }, function() {
        // complete
        console.log('complete');
        // 解除按钮禁用
        _this.data.disabled = false;
      });
    }

  },
  //微信支付
  wxpay: function (order_id) {//微信支付
  
    var that = this;
    var options = that.data.options;
    // var price = Number(that.data.goodsDetail.price) + Number(that.data.prices) - that.data.coupon;
    var p = {
      openid: wx.getStorageSync('userInfo').member_wxopenid,
      member_id: wx.getStorageSync('uid'),
      // inviter_id: that.data.inviter_id,
      buyer_name: wx.getStorageSync('userInfo').member_nickname,
      type:11,
      price: that.data.order_total_price,
      goods_name: '送发发商城',
      goods_price: that.data.order_total_price,
      goods_num: 1
    };

    //微信支付
    App._post_form('Wxpays/pay', p, function (e) {

      console.log(e.data);//微信data

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
              if(options.order_type === 'cart'){
                that.cartUpdate();
              }else{
                that.orderState(order_id);
              }
            }else{
              wx.redirectTo({
                url: '../order/index?type=payment',
              });
            }
            return;

          }
        })

    })
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
          if(that.data.options.order_type === 'buyNow'){
            wx.redirectTo({
              url: '../order/detail?order_id=' + order_id + "&goods_id=" + that.data.goods_list[0].pgoods_id,
            });
          }else if(that.data.options.order_type === 'cart'){
            wx.redirectTo({
              url: '../order/index?type=payment',
            });
          }
        }
      });
    }
  })
},

//修改订单状态
cartUpdate: function(){
  var that = this;
  console.log(that.data.token);
  var p = {orderids: that.data.orderids,tokens: that.data.token,member_id: wx.getStorageSync('uid')};
  App._post_form('Apis/cartUpdate', p, function (res) {
    if(res.code == 0){
      wx.showModal({
        title: '提示',
        content: '支付成功',
        success: function(res){
          wx.redirectTo({
            url: '../order/index?type=payment',
          });
        }
      });
    }
  })
},

  /**
   * 快捷导航 显示/隐藏
   */
  commonNav: function() {
    this.setData({
      nav_select: !this.data.nav_select
    });
  },

  /**
   * 快捷导航跳转
   */
  nav: function(e) {
    let url = '';
    switch (e.currentTarget.dataset.index) {
      case 'home':
        url = '../index/index';
        break;
      case 'fenlei':
        url = '../category/index';
        break;
      case 'cart':
        url = '../flow/index';
        break;
      case 'profile':
        url = '../user/index';
        break;
    }
    wx.switchTab({
      url
    });
  },
  coupon: function(){
    var that = this;
    var options = that.data.options;
    if(options.order_type == 'buyNow'){
      wx.redirectTo({
        url: '../coupon/coupon?goods_id='+options.goods_id+'&goods_num='+options.goods_num+'&order_type=buyNow&limit_price='+that.data.limit_price+'&type='+options.type,
      })
    }else if(options.order_type == 'cart'){
      wx.redirectTo({
        url: '../coupon/coupon?order_type=cart&limit_price='+that.data.limit_price,
      })
    }
  }

});