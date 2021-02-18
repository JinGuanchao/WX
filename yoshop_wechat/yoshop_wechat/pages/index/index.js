let App = getApp();

Page({
  data: {
    // banner轮播组件属性
    indicatorDots: true,  // 是否显示面板指示点	
    autoplay: true,       // 是否自动切换
    interval: 3000,       // 自动切换时间间隔
    duration: 800,        // 滑动动画时长
    imgHeights: {},       // 图片的高度
    imgCurrent: {},       // 当前banne所在滑块指针

    // 页面元素
    items: {},
    newest: {},
    best: {},

    scrollTop: 0,
  },

  onLoad: function (options) {
    var that = this;
    // 设置页面标题
    App.setTitle();

    // 获取首页数据
    this.getIndexData();
    this.getIndexNew();
    this.getIndexLike();
    if(options.inviter_id){
      wx.setStorageSync('inviter_id', options.inviter_id);
    }
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
  onShow: function(){
    if(wx.getStorageSync('uid')){
      if(wx.getStorageSync('userInfo').inviter_id == null){
        if(wx.getStorageSync('inviter_id')){
          wx.navigateTo({
            url: '../receive/receive',
          })
        }
      }
    }else{
      if(wx.getStorageSync('inviter_id')){
        wx.navigateTo({
          url: '../receive/receive',
        })
      }
    }
  },

  /**
   * 获取首页轮播数据
   */
  getIndexData: function () {
    let _this = this;
    App._get('Api/adv_index', {ap_id: 1}, function (result) {
      if (result.code === 0) {
        _this.setData({items:result});
      } else {
        App.showError(result.msg);
      }
    });
  },
  //获取首页新品推荐数据
  getIndexNew: function(){
    let _this = this;
    App._get('Apis/commend', {}, function (result) {
      if (result.code === 0) {
        _this.setData({newest:result.data});
      } else {
        App.showError(result.msg);
      }
    });
  },

  //获取首页猜您喜欢数据
  getIndexLike: function(){
    let _this = this;
    App._get('Apis/goods_list', {}, function (result) {
      if (result.code === 0) {
        _this.setData({best:result.data});
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 计算图片高度
   */
  imagesHeight: function (e) {
    let imgId = e.target.dataset.id,
      itemKey = e.target.dataset.itemKey,
      ratio = e.detail.width / e.detail.height, // 宽高比
      viewHeight = 750 / ratio, // 计算的高度值
      imgHeights = this.data.imgHeights;

    // 把每一张图片的对应的高度记录到数组里
    if (typeof imgHeights[itemKey] === 'undefined') {
      imgHeights[itemKey] = {};
    }
    imgHeights[itemKey][imgId] = viewHeight;
    // 第一种方式
    let imgCurrent = this.data.imgCurrent;
    if (typeof imgCurrent[itemKey] === 'undefined') {
      imgCurrent[itemKey] = Object.keys(this.data.items[itemKey].data)[0];
    }
    this.setData({ imgHeights, imgCurrent });
  },

  bindChange: function (e) {
    let itemKey = e.target.dataset.itemKey
      , imgCurrent = this.data.imgCurrent;
    // imgCurrent[itemKey] = e.detail.current;
    imgCurrent[itemKey] = e.detail.currentItemId;
    this.setData({ imgCurrent });
  },

  goTop: function (t) {
    this.setData({ scrollTop: 0 });
  },

  scroll: function (t) {
    this.setData({
      indexSearch: t.detail.scrollTop
    }), t.detail.scrollTop > 300 ? this.setData({
      floorstatus: !0
    }) : this.setData({
      floorstatus: !1
    });
  },

  onShareAppMessage: function() {
    var that = this;
    if(wx.getStorageSync('uid') != undefined){
      return {
        title: '转发',
        path: '/pages/index/index?&inviter_id='+wx.getStorageSync('uid'),
        success: function(res) {}
      }
    }else{
      return {
        title: '转发',
        path: '/pages/index/index',
        success: function(res) {}
      }
    }
  },
  gotoextension(){
    if(wx.getStorageSync('uid')){
      wx.navigateTo({
        url: '/pages/user_extension/user_extension',
      })
    }else{
      wx.navigateTo({
        url: '/pages/auth/authorization',
      })
    }
  },
  gotocoupon:function(){
    wx.navigateTo({
      url: '/pages/token/token',
    })
  },
  // gotoculture: function(){
  //   wx.showToast({
  //     title: '敬请期待',
  //   })
  // },
  gotovideo: function(){
    wx.navigateTo({
      url: '/pages/video/video',
    })
  },
  gotorank:function(){
    wx.navigateTo({
      url: '/pages/rank/rank',
    })
  }
});
