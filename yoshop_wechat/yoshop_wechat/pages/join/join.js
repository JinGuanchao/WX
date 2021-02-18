var App = getApp();
// var common = require("../../utils/common.js");
Page({
  data: {
    checkboxItems: [
      { name: 'USA', value: '我已了解并阅读了' },
    ],
    content:'',
  },
  modalTap: function () {
    var that=this;
    wx.showModal({
      title: '免责声明',
      content:that.data.content,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
  },
// 表单
  reg: function (e) {
    var that=this;
    var formdata=e.detail.value;
    if(!that.data.logo){
      wx.showToast({
        title: '请选择店铺logo',
      })
      return;
    }
    if(!e.detail.value.shop_name){
      wx.showToast({
        title: '请填写店铺名称',
      })
      return;
    }
    if(!e.detail.value.contacts_name){
      wx.showToast({
        title: '请填写联系人',
      })
      return;
    }
    if(!e.detail.value.contacts_phone){
      wx.showToast({
        title: '请填写手机号',
      })
      return;
    }
    if(!e.detail.value.id_number){
      wx.showToast({
        title: '请填写身份证号',
      })
      return;
    }
    if(!e.detail.value.shop_detail){
      wx.showToast({
        title: '请填写店铺介绍',
      })
      return;
    }
    if(!that.data.id_image1){
      wx.showToast({
        title: '请选择身份证图片',
      })
      return;
    }
    if(!that.data.id_image2){
      wx.showToast({
        title: '请选择身份证反面',
      })
      return;
    }
    if(!that.data.id_photo){
      wx.showToast({
        title: '请选择营业执照',
      })
      return;
    }
    if (that.data.checkboxItems[0].checked==true){
      var p = {
        member_id: wx.getStorageSync('uid'),
        member_name: wx.getStorageSync('userInfo').member_nickname,
        shop_name: e.detail.value.shop_name,
        contacts_name: e.detail.value.contacts_name,
        contacts_phone: e.detail.value.contacts_phone,
        id_number: e.detail.value.id_number,
        shop_detail: e.detail.value.shop_detail,
        shop_logo: that.data.logo,
        id_image1: that.data.id_image1,
        id_image2: that.data.id_image2,
        id_photo: that.data.id_photo
      };
      App._post_form('Apis/shop_join', p, function (result) {
        if (result.code === 0) {
          wx.setStorageSync('hs', 1);
          that.setData({
            hs: 1
          })
        } else {
          App.showError(result.msg);
        }
      });
    }else{
      wx.showToast({
        title: '请阅读入驻申请协议并同意！',
        duration: 2000
      });
    }
    
  },
  checkboxChange: function (e) {
    var checked = e.detail.value
    var changed = {}

  console.log(this.data.checkboxItems[0].name)
  if (checked.indexOf(this.data.checkboxItems[0].name) !== -1)
       {
    changed['checkboxItems[0].checked'] = true
      } else {
    changed['checkboxItems[0].checked'] = false
      }
    this.setData(changed)
    console.log(changed)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
      if(wx.getStorageSync('hs')){
        that.setData({
          hs: 1
        })
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
  loadinfo: function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Applyshop/applysubmitinfo',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var status = res.data.status;
        if (status == 1) {
           console.log(res.data.respondData);
           that.setData({
             guanggao:res.data.respondData.guanggao,
             content: res.data.respondData.content,
           })
        } else {
          wx.showToast({
            title: res.data.message,
          })
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      }
    })
  },
  // 上传logo
  chooselogo: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: function (res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        var imageSrc = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中!',
        })
        wx.uploadFile({
          url: 'https://jx.huachenedu.cn/public/index.php/api/apis/upload',
          filePath: imageSrc,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data',
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            self.setData({
              logo: 'https://jx.huachenedu.cn/public/' + data.path,
            })
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            // self.setData({
            //   logo: imageSrc,
            // })
          },
          fail: function ({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })

      },
      fail: function ({errMsg}) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },
  // 上传身份证正面
  chooselogo1: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: function (res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        var imageSrc = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中!',
        })
        wx.uploadFile({
          url: 'https://jx.huachenedu.cn/public/index.php/api/apis/upload',
          filePath: imageSrc,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data',
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            self.setData({
              id_image1: 'https://jx.huachenedu.cn/public/' + data.path,
            })
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            // self.setData({
            //   logo: imageSrc,
            // })
          },
          fail: function ({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })

      },
      fail: function ({errMsg}) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },
  // 上传身份证反面
  chooselogo2: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: function (res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        var imageSrc = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中!',
        })
        wx.uploadFile({
          url: 'https://jx.huachenedu.cn/public/index.php/api/apis/upload',
          filePath: imageSrc,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data',
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            self.setData({
              id_image2: 'https://jx.huachenedu.cn/public/' + data.path,
            })
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            // self.setData({
            //   logo: imageSrc,
            // })
          },
          fail: function ({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })

      },
      fail: function ({errMsg}) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },
  // 上传营业执照
  chooselogo3: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: function (res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        var imageSrc = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中!',
        })
        wx.uploadFile({
          url: 'https://jx.huachenedu.cn/public/index.php/api/apis/upload',
          filePath: imageSrc,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data',
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            
            self.setData({
              id_photo: 'https://jx.huachenedu.cn/public/' + data.path,
            })
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            // self.setData({
            //   logo: imageSrc,
            // })
          },
          fail: function ({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })

      },
      fail: function ({errMsg}) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },
  del: function (e) {
    var that = this;
    that.setData({
      logo: ""
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})
