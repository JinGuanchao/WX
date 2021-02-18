//获取应用实例
// const app = getApp(), $ = require("../../utils/util"), api = require("../../utils/api");
// var WxParse = require('../../wxParse/wxParse.js');
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    nickanme:'',
    userInfo:{},
    shareImage: '',
    code_img: '',
    painting: {},
    // 此页面 页面内容距最顶部的距离
    // height: app.globalData.height * 2 + 20,
    //据上面边距
    // statusBar: app.globalData.statusBar + 40,
    tabbar: {},
    currentTab: 0, //预设默认选中的栏目
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的推广', //导航栏 中间的标题
    },
    qr_pyq:'',
    indicatorDots: false,
    circular: false,
    autoplay: false,
    interval: 3000,
    duration: 500,
    swiperIndex: 0,
    spreadList: [
      {
        id: 1,
        poster: '../../images/1.png'
      },
    ]
  },
  //后台生成二维码
  generate_code: function () {

    var that = this;
    var params = {};

    params = {
      member_id: wx.getStorageSync('uid')
    };
    App._post_form('Apis/code',{member_id:wx.getStorageSync('uid')},function(res){
      if(res.code == 0){
          that.setData({
            code_img: res.data
          })
          var userInfo = wx.getStorageSync('userInfo');
          userInfo.member_idcard_image1 = res.data;
          wx.setStorageSync('userInfo',userInfo);
      }
      
    })
    // $.post(api.generate_code, params, function (e) {
    //   console.log(e.data);

    //   that.setData({
    //     code_img: e.data
    //   })
    // });

  },

  //我的用户信息
  // getMyInfo: function () {

  //   if (!$.isAuth()) {
  //     wx.navigateTo({
  //       url: '../auth/authorization',
  //     })
  //   }

  //   var that = this;
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (!wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '../auth/authorization',
      })
      return;
    }
    that.setData({
      avatar: wx.getStorageSync('userInfo').member_avatar
    })

    that.setData({
      nickanme: wx.getStorageSync('userInfo').member_nickname,
    })

    // 引流送积分
    if (options.inviter_id) {
      // $.get(api.send_inviter, {
      //   member_id: $.uid(),
      //   pl_membername: wx.getStorageSync('nickName'),
      //   inviter_id: options.inviter_id
      // }, function (e) { });
    }
  },
  bindchange(e) {
    var spreadList = this.data.spreadList;
    this.setData({
      swiperIndex: e.detail.current,
      poster: spreadList[e.detail.current].poster,
    })
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
    var that = this;
    let user = wx.getStorageSync('userInfo');
    if (user.member_idcard_image1 == null || user.member_idcard_image1 == '') { //member_idcard_image1
      that.generate_code(); //生成二维码
    } else {
      that.setData({
        code_img: user.member_idcard_image1
      })
    }
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
    return {
      title: "分享就赚钱",
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid'),
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  eventDraw() {
    wx.showLoading({
      title: '生成海报中',
      mask: true
    })
    this.setData({
      painting: {
        width: 600,
        height: 1000,
        clear: true,
        views: [
          {
            type: 'image',
            url: '/images/1.png',
            top: 0,
            left: 0,
            width: 600,
            height: 1000
          },
          {
            type: 'image',
            url: this.data.avatar,
            top: 800,
            left: 80,
            width: 100,
            height: 100,
          },
          
          {
            type: 'text',
            content: '您的好友【' + this.data.nickanme +'】',
            fontSize: 19,
            color: 'black',
            textAlign: 'left',
            top: 800,
            left: 200,
            bolder: true
          },
          {
            type: 'text',
            content: '邀请您加入',
            fontSize: 19,
            color: 'black',
            textAlign: 'left',
            top: 850,
            left: 200,
            bolder: true
          },
          {
            type: 'image',
            url: this.data.code_img,
            top: 780,
            left: 370,
            width: 200,
            height: 200
          },
         
        ]
      }
    })
  },
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    wx.hideLoading();
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
      this.eventSave();
    }
  }

})