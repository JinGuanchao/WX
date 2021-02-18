var App = getApp();
Page({
  onLoad:function(){
    var that = this;
    if(wx.getStorageSync('uid')){
      that.setData({
        islogin: true
      })
    }else{
      that.setData({
        islogin: false
      })
    }
    console.log(that.data.islogin);
  },
  //授权弹窗操作		情况3：用户未授权，需点击button授权
  bindGetUserInfo: function(e) {
    var that = this;
    if (e.detail.userInfo) { //用户按了允许授权按钮

      // 获取到用户信息
      console.log(e.detail.userInfo)
      var u = e.detail.userInfo;
      var p = {};

      wx.login({
        success: function(r) {
          console.log(r)

          u.code = r.code;
          u.appId = 'wxb0c3c2d00135f7b3';

          wx.setStorageSync('ucode', u.code);
          wx.setStorageSync('uappid', u.appId);

          // 获取用户信息
          wx.getUserInfo({
            success: function(data) {

              var rawData = data.rawData;
              var signature = data.signature;
              var encryptedData = data.encryptedData;
              var iv = data.iv;

              wx.request({
                url: 'https://jx.huachenedu.cn/public/index.php/api/Wxlogin/logins',
                data: {
                  "code": u.code,
                  "rawData": rawData,
                  "signature": signature,
                  "iv": iv,
                  "encryptedData": encryptedData
                },
                method: 'GET',
                success: function(res) {
                  console.log(res.data);
                  var result = res.data;

                  if (result.code == 0) {
                    wx.setStorageSync('wxapp_openid', result.data.member_wxopenid);
                    wx.setStorageSync('userInfo', result.data);
                    wx.setStorageSync('shop_id', result.data.shop_id);
                    wx.setStorageSync('uid', result.data.member_id);
                    wx.setStorageSync('avatarUrl', result.data.member_avatar);
                    wx.setStorageSync('nickName', result.data.member_nickname);
                    App._post_form('Apis/send_inviter',{member_id:wx.getStorageSync('uid'),inviter_id:wx.getStorageSync('inviter_id')},function(res){
                      if(res.code == 0){
                        var userInfo = wx.getStorageSync('userInfo');
                        userInfo.inviter_id = wx.getStorageSync('inviter_id');
                        wx.setStorageSync('userInfo',userInfo);
                        if(res.message == '已经绑定过邀请人'){
                          wx.showToast({
                            title: '已绑定过邀请人',
                          })
                        }else if(res.message == '送积分成功'){
                          wx.showToast({
                            title: '领取成功',
                          })
                          that.setData({
                            state: true
                          })
                        }
                        
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '登录失败',
                    })
                  }
                }
              })
            }
          })
        },
        fail: function() {
          log('wxlogin fail')
        }
      })

    } else { //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入~',
        showCancel: false,
        confirmText: '我知道了',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“我知道了”')
            //返回前一页面
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },
  receive: function(){
    var that = this;
    App._post_form('Apis/send_inviter',{member_id:wx.getStorageSync('uid'),inviter_id:wx.getStorageSync('inviter_id')},function(res){
      if(res.code == 0){
        var userInfo = wx.getStorageSync('userInfo');
        userInfo.inviter_id = wx.getStorageSync('inviter_id');
        wx.setStorageSync('userInfo',userInfo);
        if(res.message == '已经绑定过邀请人'){
          wx.showToast({
            title: '已绑定过邀请人',
          })
        }else if(res.message == '送积分成功'){
          wx.showToast({
            title: '领取成功',
          })
          that.setData({
            state: true
          })
        }
        
      }
    })
  }
})