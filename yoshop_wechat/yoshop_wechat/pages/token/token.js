// pages/integral/integral.js
//获取应用实例
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false, // 显示modal弹窗
    single: true, // false 显示两个按钮，如果想显示一个改为true即可
    existence: false,//false 显示按钮 true 不显示按钮
    list: [],
    credit:0,//总积分数
    userInfo:'',
    btnTop:'',
    showTextModal: false,
  },
  integralExplain: function () {
    this.setData({
      showTextModal: true,
    })
  },
  //滚动条监听
  onPageScroll: function (ev) {
    this.setData({
      scrollTop: ev.scrollTop
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      credit: options.credit
    })
    
    // let isPhone = app.globalData.isIpx;
    // if (isPhone) {
    //   this.setData({
    //     btnTop: '30rpx'
    //   })
    // }

    this.getUserDetail();
    this.integralList();//积分列表
  },
  /**
   * 获取当前用户信息
   */
  getUserDetail: function () {
    let _this = this;
    App._get('Apis/userInfo', {member_id:wx.getStorageSync('uid')}, function (result) {
      if (result.code === 0) {
        _this.setData({
          member_token: result.data.member_token
        });
      }
    });
  },
  integralList: function(){
    var that = this;

    var clist = {};


    clist = { member_id: wx.getStorageSync('uid')};
    App._post_form('Apis/point_detail_indexs',clist, function (res) {
      that.setData({
        list:res.data
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  integralPay: function(){
    if (!$.isAuth()) {
      wx.navigateTo({
        url: '../auth/authorization',
      })
      return;
    }

    wx.navigateTo({
      url: '/pages/integralpay/integralpay',
    })
  },
  invisible: function(){
    this.setData({ showTextModal: false });
    this.setData({ isScroll: true });
  },
})