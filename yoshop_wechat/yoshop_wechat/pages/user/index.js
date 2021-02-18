let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    orderCount: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 获取当前用户信息
    this.getUserDetail();
    this.orderCount();
    App._post_form('Api/tabbar',{}, function (res) {
      if(res.status == 1){
        that.setData({
          hide: '../join/join'
        })
      }else{
        that.setData({
          hide: false
        })
      }
    });
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail: function () {
    let _this = this;
    App._get('Apis/userInfo', {member_id:wx.getStorageSync('uid')}, function (result) {
      if (result.code === 0) {
        _this.setData({
          user: result.data
        });
        var userInfo = wx.getStorageSync('userInfo');
        userInfo = result.data;
        wx.setStorageSync('userInfo',userInfo);
      } else {
        App.showError(result.msg);
      }
    });
  },
  //获取用户订单信息
  orderCount: function(){
    var that = this;
    App._get('Apis/orderCount', {member_id:wx.getStorageSync('uid')}, function (result) {
      that.setData({
        orderCount: result
      })
    });
  },
  gotophone: function() {
    wx.makePhoneCall({
      phoneNumber: '400-119-8676',
    })
  },
  integral:function(){
    wx.navigateTo({
      url: './integral/integral',
    })
  },
  team: function(){
    wx.navigateTo({
      url: './team/team',
    })
  }
})