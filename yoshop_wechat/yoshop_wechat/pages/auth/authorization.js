
let App = getApp(),$ = require("../../utils/util");
Page({
  data: {
    motto: '北京君享幸福健康管理有限公司',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {

    wx.setNavigationBarTitle({
      title: '授权登录',
    })

    console.log('当前页' + getCurrentPages()[getCurrentPages().length - 1].route)
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              var u = res.userInfo;

              wx.setStorageSync('avatarUrl', u.avatarUrl);
              wx.setStorageSync('nickName', u.nickName);



            }
          })
        }
      }
    })
  },

  //授权弹窗操作		情况3：用户未授权，需点击button授权
  bindGetUserInfo: function(e) {
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
                    if(result.message == '注册成功'){
                      wx.showToast({
                        title: '注册成功',
                      })
                      setTimeout(function(){
                        wx.navigateBack({
                          delta: 1
                        })
                      },2000)
                    }else if(result.message == '获取用户信息'){
                      wx.showToast({
                        title: '登录成功',
                      })
                      setTimeout(function(){
                        wx.navigateBack({
                          delta: 1
                        })
                      },2000)
                    }
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
  //返回
  goback:function(){
    wx.navigateBack();
  }
})