let App = getApp();

Page({
  data: {
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",

    curNav: true,
    curIndex: 0,
  
    list: [
      // {
      //   name:'健康品',
      //   child:[
      //     {
      //       name:'药品'
      //     }
      //   ]
      // },
      // {
      //   name:'大保健',
      //   child:[
      //     {
      //       name:'药品1'
      //     }
      //   ]
      // }
    ],
  },

  onLoad: function () {
    let _this = this;

    // 获取分类列表
    this.getCategoryList();
  },

  /**
   * 获取分类列表
   */
  getCategoryList: function () {
    let _this = this;
    App._get('Apis/category', {}, function (result) {
      if (result.code === 0) {
        console.log(result);
        _this.setData({
          list: result.data,
        });
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 选中分类
   */
  selectNav: function (t) {
    let curNav = t.target.dataset.id
      , curIndex = parseInt(t.target.dataset.index);
    this.setData({
      curNav,
      curIndex,
      scrollTop: 0
    });
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage: function () {
    return {
      title: "全部分类",
      desc: "",
      path: "/pages/category/index"
    };
  }
  
});
