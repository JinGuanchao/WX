let App = getApp();
Page({
  data:{
    current: 0
  },
  onLoad: function(){
    var that = this;
    that.setData({
      member_nickname: wx.getStorageSync('userInfo').member_nickname,
      member_avatar: wx.getStorageSync('userInfo').member_avatar
    })
  },
  onShow: function(){
    var that = this;
    if(that.data.current == 0){
      that.myvideo();
    }
  },
  //我的作品
  myvideo: function(){
    var that = this;
    App._post_form('Apis/myvideo',{member_id: wx.getStorageSync('uid')}, function (res) {
      if(res.code == 0){
        that.setData({
          videoList: res.data
        })
      }
    });
  },
  //我喜欢的作品
  mylike: function(){
    var that = this;
    App._post_form('Apis/mylike',{member_id: wx.getStorageSync('uid')}, function (res) {
      that.setData({
        videoList: res
      })
    });
  },
  upload_video: function(){
    wx.navigateTo({
      url: '/pages/video/upload_video/upload_video',
    })
  },
  swichNav: function(e){
    var that = this;
    that.setData({
      current: e.currentTarget.dataset.current
    })
    if(e.currentTarget.dataset.current == 1){
      that.mylike();
    }else{
      that.myvideo();
    }
  },
})