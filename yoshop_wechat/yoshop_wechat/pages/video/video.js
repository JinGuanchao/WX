// const app = getApp(), $ = require("../../utils/util"), api = require("../../utils/api");
let App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoDetail: '',
    start: 0,
    current: 0,
    startTouch: '',
    startNum:'0',
    //其中的 视频url(videoUrl) 封面url(videoImageUrl) 头像url(headUrl) 的话大家自己填上就行
    videoList: [], //接口返回的视频列表。
    touch: false,
    touchStartTime: 0, //触摸开始时间
    touchEndTime: 0, // 触摸结束时间
    lastTapTime: 0, // 单击事件点击后要触发的函数
    lastTapTimeoutFunc: null,
    switchTo:true,
    page: 0,
    isNoticeTrue: false,
    inputBoxShow: false,
    content: ''
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var listTem = that.data.videoList;
    that.member_like();
    that.dataList();
    App._post_form('Api/tabbar',{}, function (res) {
      if(res.status == 1){
        that.setData({
          hide: 1
        })
      }else{
        that.setData({
          hide: 2
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('videoplayer');
    this.setData({
      updateState: true
    })
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
  dataList: function () {//加载数据
    var that = this;
    App._post_form('Apis/videoList', {
      startNum: Number(that.data.startNum),
      limit: 5
    }, function(res) {
      var listTem = that.data.videoList;
      var dataList = res;
      //添加新任务列表
      that.setData({
        videoList: listTem.concat(dataList)
      })
      if(res.data == []){
        that.setData({
          startNum: Number(that.data.startNum) - 5,
        })
      }
      that.islike();
    });

    // wx.request({
    //   url: 'https://jx.huachenedu.cn/public/index.php/api/videoList',//把这里换成自己的接口地址
    //   data: {
    //     // userId: '',
    //     startNum: Number(that.data.startNum),
    //     limit: 5
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: function (res) {
    //     var listTem = that.data.videoList;
    //     var dataList = res.data;
    //     //添加新任务列表
    //     that.setData({
    //       videoList: listTem.concat(dataList)
    //     })
    //     if(res.data == []){
    //       that.setData({
    //         startNum: Number(that.data.startNum) - 5,
    //       })
    //     }
    //     that.islike();
    //   }
    // })
  },
  // 下面主要模仿滑动事件
  touchstart: function (e) {
    this.setData({
      touchStartTime: e.timeStamp,
      showGuide: false
    })
    let startTouch = e.changedTouches[0]
    this.setData({
      startTouch: startTouch,
      touch: false
    })
  },
  touchmove: function (e) {
    let Y = e.changedTouches[0].pageY - this.data.startTouch.pageY;
  },
  touchend: function (e) {
    this.setData({
      touchEndTime: e.timeStamp
    })
    this.getDirect(this.data.startTouch, e.changedTouches[0])
  },
  touchcancel: function (e) {
    this.getDirect(this.data.startTouch, e.changedTouches[0])
  },
  // 计算滑动方向
  getDirect: function (start, end) {
    var X = end.pageX - start.pageX,
      Y = end.pageY - start.pageY;
    if (Math.abs(X) > Math.abs(Y) && X > 0) {
      console.log("left 2 right");
    }
    else if (Math.abs(X) > Math.abs(Y) && X < 0) {
      console.log("right 2 left");
    }
    else if (Math.abs(Y) > Math.abs(X) && Y > 40) {
      if (this.data.current > 0) {
        this.setData({
          touch: true,
          transitionOver: false
        })
        this.pre()
      } else {
        this.setData({
          current: 0
        })
      }
    }
    else if (Math.abs(Y) > Math.abs(X) && Y < -40) {
      if (this.data.current < this.data.videoList.length - 2) {
        this.setData({
          touch: true
        })
        this.next()
      } else {
        var startNum = parseInt(this.data.startNum) + 5;
        this.setData({
          startNum: startNum,
        })
        this.dataList();
        this.setData({
          current: this.data.videoList.length - 1
        })
      }
    }
  },
  // 播放上一个
  pre: function () {
    this.setData({
      current: this.data.current - 1,
    })
  },
 
  // 播放下一个
  next: function () {
    this.setData({
      current: this.data.current + 1,
    })
  },
  //点击暂停/开始
  videoTap: function () {
    var that = this;
    //获取video
    this.videoContext = wx.createVideoContext('videoplayer')
    this.audioCtx = wx.createAudioContext('myAudio')
    if (this.data.play) {
      //开始播放
      this.videoContext.play()//开始播放
      this.audioCtx.play()
      this.setData({
        play: false
      })
    } else {
      //当play==false 显示图片 暂停
      this.videoContext.pause()//暂停播放
      this.audioCtx.pause()
      this.setData({
        play: true
      })
    }
  },
  //播放条时间改表触发
  videoUpdate(e) {
    if (this.data.updateState) { //判断拖拽完成后才触发更新，避免拖拽失效
      let sliderValue = e.detail.currentTime / e.detail.duration * 100;
      this.setData({
        sliderValue: sliderValue,
        duration: e.detail.duration
      })
    }
  },
  sliderChanging(e) {
    this.setData({
      updateState: false //拖拽过程中，不允许更新进度条
    })
  },
  //拖动进度条触发事件
  sliderChange(e) {
    if (this.data.duration) {
      this.videoContext.seek(e.detail.value / 100 * this.data.duration); //完成拖动后，计算对应时间并跳转到指定位置
      this.setData({
        sliderValue: e.detail.value,
        updateState: true //完成拖动后允许更新滚动条
      })
    }
  },
  onShareAppMessage: function (ops) { 
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  goTop: function(){
    var that = this;
    that.setData({
      startNum: '0',
      current:0,
      videoList: []
    })
    that.dataList();
  },
  // 视频下载
  handleDownload(e) {
    wx.showToast({
      title: '开始下载...',
      mask: true,
      icon: 'loading'
    })
    var that = this;
    var videoList = that.data.videoList;
    var current = that.data.current;
    var fileName = videoList[current].video_src;
    if(videoList[current].down_url == ''){
      App._post_form('Api/FFMpeg', {fileName: fileName,video_id: videoList[current].video_id}, function(e){
        if(e.code == 0){
          videoList[current].down_url = e.filename;
          that.setData({
            videoList: videoList
          })
          that.down(e.filename);
        }
      })
    }else{
      that.down(videoList[current].down_url);
    }
  },
  //执行下载
  down: function(url){
    const downloadTask=wx.downloadFile({
      url: 'https://jx.huachenedu.cn/public/public/uploads/files/'+url,
      success: res => {
        let filePath = res.tempFilePath;
        wx.saveVideoToPhotosAlbum({
          filePath,
          success: file => {
            wx.showModal({
              title: '提示',
              content: '下载成功',
            });

          },
          fail: err => {
            console.log(err)
            if (err.errMsg === 'saveVideoToPhotosAlbum:fail auth deny') {
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: data => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击下载即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                  })
                }
              })
            }
          }
        })
      }
    })
    downloadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: res.progress + '%',
        mask: true
      })
      if(res.progress == 100){
        wx.hideLoading()
      }
      console.log('下载进度', res.progress)
      console.log('已经下载的数据长度', res.totalBytesWritten)
      console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    })
  },
  //该用户点赞数据
  member_like: function(){
    var that = this;
    wx.request({
      url: 'https://jx.huachenedu.cn/public/index.php/api/Apis/memberLike',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
       member_id: wx.getStorageSync('uid')
      },
      success: function (res) {
        wx.setStorageSync('zan',res.data.data);
      }
     })
  },
  //点赞处理函数
  zan: function (video_id) {
    var that = this;
    if (!wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '../auth/authorization',
      })
      return;
    }
    var show;//传递到数据库点赞的状态   
    var cookie_mid = wx.getStorageSync('zan')||[];//获取全部点赞的mid    
    var newmessage = [];
    var videoList = that.data.videoList;
    for (var i = 0; i < videoList.length; i++) {
     if (videoList[i].video_id == video_id) {//遍历找到对应的id
      var num = videoList[i].like_num;//当前赞数
      var isshow; //点赞的状态
      if (cookie_mid.includes(video_id)) {//说明已经点过赞,取消赞  
       for (var j = 0; j < cookie_mid.length; j++) {
        if (cookie_mid[j] == video_id) {
         cookie_mid.splice(j, 1);//删除取消赞的mid 
        }
       }
       --num;
       isshow = 0;//点赞的状态
       that.setData({
        [`videoList[${i}].like_num`]: num, //es6模板语法（反撇号字符）
        [`videoList[${i}].image`]: "../../images/fav.png",
       })
       wx.setStorageSync('zan', cookie_mid);
       wx.showToast({
        title: "取消点赞!",
        icon: 'none'
       }) 
      //  console.log("前端取消点赞"+isshow)
   
      } else {
       isshow = 1;//点赞的状态
       ++num;
       that.setData({
        [`videoList[${i}].like_num`]: num,//es6模板语法（反撇号字符）
        [`videoList[${i}].image`]: "../../images/faved.png",
       })
       cookie_mid.unshift(video_id);//新增赞的mid
       wx.setStorageSync('zan', cookie_mid);
       wx.showToast({
        title: "点赞成功!",
        icon: 'none'
       })
      //  console.log("前端点赞成功" + isshow)
      }
      //console.log(cookie_mid); 
      //点赞数据同步到数据库
      wx.request({
       url: 'https://jx.huachenedu.cn/public/index.php/api/Api/like',
       method: 'POST',
       header: { 'Content-Type': 'application/x-www-form-urlencoded' },
       data: {
        video_id: video_id,
        member_id: wx.getStorageSync('uid'),
        type: 2
       },
       success: function (res) {
        console.log(res.data);
       }
      }) 
     }
    }
   },
   
  /**
   * 点赞
   */
   favorclick: function (options){
    var video_id = options.currentTarget.dataset.id;//此处找到列表的id
    this.zan(video_id);
   },
  //  图标显示
  islike: function(){
    var that = this;
    var videoList = that.data.videoList;
    var cookie_mid = wx.getStorageSync('zan')||[];
    for(var i = 0; i < videoList.length; i++){
      console.log(cookie_mid.includes(videoList[i].video_id));
      if (cookie_mid.includes(videoList[i].video_id)) {
        videoList[i].image = '../../images/faved.png';
      }else{
        videoList[i].image = '../../images/fav.png';
      }
    }
    that.setData({
      videoList: videoList
    })
  },
  //关闭规则提示
  hideNotice: function () {
    this.setData({
      isNoticeTrue: false
    })
  },
  //短视频所有评论
  comment: function(){
    this.setData({
      isNoticeTrue: true
    })
    var that = this;
    var videoList = that.data.videoList;
    wx.request({
      url: 'https://jx.huachenedu.cn/public/index.php/api/Apis/getComment',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
       video_id: videoList[that.data.current].video_id,
      },
      success: function (res) {
        that.setData({
          comment: res.data
        })
        wx.request({
          url: 'https://jx.huachenedu.cn/public/index.php/api/Apis/getReply',
          method: 'POST',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {
           video_id: videoList[that.data.current].video_id,
          },
          success: function (result) {
            console.log(result.data.replys);
            that.setData({
              replys: result.data.reply,
              replyes: result.data.replys
            })
          }
        })
      }
     }) 
  },
  //发表评论
  formSubmit: function(e){
    if (!wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '../auth/authorization',
      })
      return;
    }
    if(e.detail.value.content == ''){
      wx.showModal({
        title: '提示',
        content: '请输入内容'
      });
      return false;
    }
    var that = this;
    var videoList = that.data.videoList;
    var comment = that.data.comment;
    wx.request({
      url: 'https://jx.huachenedu.cn/public/index.php/api/Apis/comment',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
       video_id: videoList[that.data.current].video_id,
       member_id: wx.getStorageSync('uid'),
       content: e.detail.value.content
      },
      success: function (res) {
        if(res.data.code == 0){
          var message = {
            video_id: videoList[that.data.current].video_id,
            member_id: wx.getStorageSync('uid'),
            content: e.detail.value.content,
            member_avatar: wx.getStorageSync('userInfo').member_avatar,
            member_nickname: wx.getStorageSync('userInfo').member_nickname
          };
          comment.unshift(message);
          wx.showToast({
            title: "评论成功!",
            icon: 'none'
           })
           that.setData({
             comment: comment,
             content: '',
             [`videoList[${that.data.current}].message`]: videoList[that.data.current].message+1,//es6模板语法（反撇号字符）
           })
        }else{
          wx.showToast({
            title: res.data.message,
          })
        }
      }
     }) 
  },
  // 回复
  showInputBox: function (e) {
    var bmember_id = e.currentTarget.dataset.member_id || 0;
    var bmember_nickname = e.currentTarget.dataset.member_nickname || null;
    var replys_id = e.currentTarget.dataset.reply_id || 0;
    if(bmember_id == wx.getStorageSync('uid')){
      wx.showToast({
        title: "不能自己回复自己!",
        icon: 'none'
      })
      return false;
    }
    this.setData({ inputBoxShow: true });
    this.setData({ isScroll: false });
    this.setData({
      video_id: e.currentTarget.dataset.video_id,
      comment_id: e.currentTarget.dataset.comment_id,
      bmember_id: bmember_id,
      bmember_nickname: bmember_nickname,
      replys_id: replys_id
    })
  },
  invisible: function(){
    this.setData({ inputBoxShow: false });
    this.setData({ isScroll: true });
  },
  replys: function(e){
    var that = this;
    var replys = that.data.replys;
    var replyes = that.data.replyes;
    that.invisible();
    wx.request({
      url: 'https://jx.huachenedu.cn/public/index.php/api/reply',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
       video_id: that.data.video_id,
       comment_id: that.data.comment_id,
       replys_id: that.data.replys_id,
       member_id: wx.getStorageSync('uid'),
       bmember_id: that.data.bmember_id,
       bmember_nickname: that.data.bmember_nickname,
       content: e.detail.value.content
      },
      success: function (res) {
        var message = {
          video_id: that.data.video_id,
          member_id: wx.getStorageSync('uid'),
          replys_id: that.data.replys_id,
          comment_id: that.data.comment_id,
          content: e.detail.value.content,
          member_avatar: wx.getStorageSync('userInfo').member_avatar,
          member_nickname: wx.getStorageSync('userInfo').member_nickname,
          bmember_id: that.data.bmember_id,
          bmember_nickname: that.data.bmember_nickname,
        };
        if(that.data.replys_id != 0){
          replyes.unshift(message);
          that.setData({
            replyes: replyes
          })
        }else{
          replys.unshift(message);
          that.setData({
            replys: replys
          })
        }
        
        if(res.data.code == 0){
          wx.showToast({
            title: "回复成功!",
            icon: 'none'
           })
           that.setData({
             content: ''
           })
        }
      }
     })
  },
  myvideo: function(){
    if(wx.getStorageSync('uid')){
      wx.navigateTo({
        url: '/pages/video/myvideo/myvideo',
      })
    }else{
      wx.navigateTo({
        url: '/pages/auth/authorization',
      })
    }
  }
})