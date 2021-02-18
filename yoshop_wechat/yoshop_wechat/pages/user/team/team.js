// pages/integral/integral.js
//获取应用实例
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    total:'',
    showModal: false, // 显示modal弹窗
    single: true, // false 显示两个按钮，如果想显示一个改为true即可
    existence: false,//false 显示按钮 true 不显示按钮
    list: [],
    credit: 0,//总积分数
    userInfo: ''
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
    that.setData({
      member_level: wx.getStorageSync('userInfo').member_level,
    })
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.integralList();//积分列表
  },
  integralList: function () {
    var that = this;

    var clist = {};


    clist = { member_id: wx.getStorageSync('uid') };
    App._post_form('Apis/user_team',clist, function (res) {
      that.setData({
        list: res.data,
        total: res.total
      })
    });
  },
  // gotoNextMember:function(e){

  //   var that = this;

  //   let index = e.currentTarget.dataset.index;
  //   let member = that.data.list[index];
  //   var clist = {};

  //   clist = { member_id: member.member_id };

  //   $.post(api.user_team, clist, function (e) {

  //     console.log(e.data);

  //     that.setData({
  //       list: e.data,
  //       total: e.total
  //     })
  //   });

  // },
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

  }
})