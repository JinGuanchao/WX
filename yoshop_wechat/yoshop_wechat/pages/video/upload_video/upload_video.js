// const app = getApp(), $ = require("../../utils/util"), api = require("../../utils/api");
var App = getApp();
Page({
  data:{
    // text:"这是一个页面"
    videoSource: '',
    videoHidden: true,
    key: [],
    title: '',
    inputBoxShow: false,
    isScroll: true,
    upload: true,
    size: 204800
  },
  showInputBox: function () {
    this.setData({ inputBoxShow: true });
    this.setData({ isScroll: false });
  },
  invisible: function(){
    this.setData({ inputBoxShow: false });
    this.setData({ isScroll: true });
  },
 listenerBtnOpenVideo: function() {
     var that = this;
     wx.chooseVideo({
         //相机和相册
         sourceType: ['album', 'camera'],
         //录制视频最大时长
         maxDuration: that.data.second,
         //摄像头
         camera: ['front', 'back'],
         //这里返回的是tempFilePaths并不是tempFilePath
         success: function(res){
             that.setData({
                 videoSource: res.tempFilePath,
                 videoHidden: true
             })
         },
         fail: function(e) {
           console.log(e)
         }
     })
 },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.getBgms();
  },
  //获取bgm列表
  getBgms: function(){
    var that = this;
    wx.request({
      url: 'https://jx.huachenedu.cn/public/index.php/api/APi/bgmList',
      success: function(res){
        that.setData({
          bgmList: res.data.data
        })
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  goback: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //底部弹出框
  //点击我显示底部弹出框
clickme:function(){
  this.showModal();
},

//显示弹框
 showModal: function () {
   // 显示遮罩层
   var animation = wx.createAnimation({
     duration: 200,
     timingFunction: "linear",
     delay: 0
   })
   this.animation = animation
   animation.translateY(300).step()
   this.setData({
     animationData: animation.export(),
     showModalStatus: true
   })
   setTimeout(function () {
     animation.translateY(0).step()
     this.setData({
       animationData: animation.export()
     })
   }.bind(this), 200)
 },
 //隐藏探矿
 hideModal: function () {
   // 隐藏遮罩层
   var animation = wx.createAnimation({
     duration: 200,
     timingFunction: "linear",
     delay: 0
   })
   this.animation = animation
   animation.translateY(300).step()
   this.setData({
     animationData: animation.export(),
   })
   setTimeout(function () {
     animation.translateY(0).step()
     this.setData({
       animationData: animation.export(),
       showModalStatus: false,
       key: '',
       select: false
     })
   }.bind(this), 200)
 },
 selectBgm: function(e){
   var that = this;
   this.setData({
     key: e.currentTarget.dataset.index,
     select: true
   })
  },
  selectBgms: function(e){
    var that = this;
    this.setData({
      showModalStatus: false,
    })
   },
  cancel: function(e){
    var that = this;
    this.setData({
      key: '',
      showModalStatus: false,
      select: false
    })
  },
  //接受title
  formSubmit: function(e){
    this.setData({
      title: e.detail.value.title,
      inputBoxShow: false,
      isScroll: true
    })
  },
  //视频上传
  complete: function(){
    var that = this;
    var video = that.data.videoSource;
    var bgm_src = 0;
    if(!that.data.upload){
      wx.showToast({

        title: '视频正在上传',
        
        icon: 'loading'
        
      });
      return false;
    }
    if(that.data.select){
      bgm_src = that.data.bgmList[that.data.key].bgm_src;
    }
    that.setData({
      upload: false
    })
    wx.showToast({

      title: '加载中',
      
      icon: 'loading'
      
    });
    wx.uploadFile({
      url: 'https://jx.huachenedu.cn/public/index.php/api/Upload/uploadFiles',//服务器接口
      method: 'POST',//这句话好像可以不用
      filePath: video,
      header: {
        'content-type': 'multipart/form-data'
      },
      name: 'file',//服务器定义的Key值
      formData: {
        size: that.data.size,
        poster: bgm_src
      },
      success: function(res) {
        var data = JSON.parse(res.data);
        if(data.code == 0){
          var obj = {member_id: wx.getStorageSync('uid'),video_src:data.path,bgm_src: bgm_src,video_title: that.data.title,type:2};
          // $.post(api.addVideo,obj,function(e){
          //   wx.showToast({
          //     title: '上传成功',
          //   })
          //   setTimeout(function(){
          //     wx.navigateBack({
          //       delta: 1
          //     })
          //   },2000)
          // })
          App._post_form('Apis/addVideo',obj, function (res) {
            wx.showToast({
              title: '上传成功',
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },2000)
          });
        }else{
          if(wx.getStorageSync('userInfo').member_level == '普通'){
            wx.showModal({

              title: '提示',
            
              content: '你的视频大小超过限制,开通黄金VIP可发布更长的视频哦',

              success: function(res){
                if(res.confirm){
                  wx.navigateTo({
                    url: '../buy/buy',
                  })
                }
              }
            
            })
          }else{
            wx.showToast({
              title: '视频大小超过限制',
            })
          }
        }
        
      },
      fail: function() {
        console.log('接口调用失败')
      }
    })
  },
  
})