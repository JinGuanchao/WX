let App = getApp(),
 wxParse = require("../../../wxParse/wxParse.js");
Page({
  data: {
    array:['选项一','选项二','选项三'],
  },
  onLoad: function(option){
    var that = this;
    App._post_form('Apis/category', {}, function(result) {
      if (result.code === 0) {
        var arrays = [];
        for(var i=0;i<result.data.length;i++){
          arrays[i] = result.data[i].name;
        }
        that.setData({
          array: result.data,
          arrays: arrays,
          pgoods_id: option.goods_id
        });
        App.showSuccess(result.message);
      } else {
        App.showError(result.message);
      }
    });
    App._post_form('Apis/gift_detail', {pgoods_id: option.goods_id}, function(result) {
      if (result.code === 0) {
        that.setData({
          pgoods: result.data[0]
        })
      }
    });
  },
  bindPickerChange: function(e){
    this.setData({
      index: e.detail.value
    })
  },
  /** editor 部分 **/
  getEditorValue(e) {
    this.setData({
      ['formData.content']:e.detail.html
    })
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context;
      wx.showLoading({
        title: '加载内容中...',
      })
      setTimeout(function(){
        let data = that.data;
        wx.hideLoading();
        that.editorCtx.setContents({
          html: that.data.pgoods.pgoods_body,
          success: (res) => {
            console.log(res)
          },
          fail: (res) => {
            console.log(res)
          }
        })
      },1000)
    }).exec()
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },
  // insertImage() {

  //   var _this = this;
  //   wx.showLoading({
  //     title: '上传中...',
  //   })
  //   wx.chooseImage({
  //     success(res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       const tempFilePaths = res.tempFilePaths
  //       //执行上传文件操作
  //       wx.uploadFile({
  //         url: 'https://jx.huachenedu.cn/public/index.php/api/upload/uploads', //仅为示例，非真实的接口地址
  //         filePath: tempFilePaths[0],
  //         name: 'file',
  //         formData: {},
  //         success(res) {
  //           wx.hideLoading();
  //           console.log(res.data);
  //           // app.myToast('上传成功！');
  //           const data = JSON.parse(res.data);//获取到的json 转成数组格式 进行赋值 和渲染图片
  //           _this.editorCtx.insertImage({
  //             src: 'https://jx.huachenedu.cn/public/uploads/home/pointprod/' + data.data,
  //             data: {
  //               id: 'abcd',
  //               role: 'god'
  //             },
  //             success: function () {
  //               console.log('insert image success')
  //             }
  //           })
  //         },
  //         fail(e) {
  //           wx.hideLoading();
  //           console.log(e);
  //         },
  //         complete(e) {
  //           wx.hideLoading();
  //           console.log(e);
  //         }
  //       })
  //     }
  //   })
  // },
  /** editor 部分结束 **/
  uploader:function(){
    var that=this;
    
    let imagesList=[];
    
    let maxSize=1024*1024;
    
    let maxLength=5;
    
    let flag=true;
    
    wx.chooseImage({
    count: 1, //最多可以选择的图片总数
    
    sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
    
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    
    success: function(res) {
    wx.showToast({
    title: '正在上传...',
    
    icon: 'loading',
    
    mask: true,
    
    duration: 500
    
    })
    
    for(let i=0;i<res.tempFiles.length;i++){
    if(res.tempFiles[i].size>maxSize){
    flag=false;
    
    wx.showModal({
    content: '图片太大，不允许上传',
    
    showCancel: false,
    
    success: function (res) {
    if (res.confirm) {
    console.log('用户点击确定')
    
    }
    
    }
    
    });
    
    }
    
     
    
    }
    
    if (res.tempFiles.length>maxLength){
    console.log('222');
    
    wx.showModal({
    content: '最多能上传'+maxLength+'张图片',
    
    showCancel:false,
    
    success:function(res){
    if(res.confirm){
    console.log('确定');
    
    }
    
    }
    
    })
    
    }
    
    if (flag == true && res.tempFiles.length <= maxLength){
    that.setData({
    imagesList: res.tempFilePaths
    
    })
    
    }  
    
    console.log(res);
    
    },
    
    fail:function(res){
    console.log(res);
    
    }
    
    })
    
    },
    formSubmit: function(e){
      var that = this;
      var html = '';
      var imagesList = that.data.imagesList;
      var images = '';
      that.editorCtx.getContents({
        success(res){
          console.log(res);
          html = res.html;
        

          // if(!that.data.imagesList){
          //   wx.showToast({
          //     title: '请选择图片',
              
          //     mask: true,
              
          //     duration: 500
              
          //   })
          //   return;
          // }
          if(e.detail.value.pgoods_name == ''){
            wx.showToast({
              title: '请填写商品名称',
              
              mask: true,
              
              duration: 500
              
            })
            return;
          }
          if(e.detail.value.pgoods_price == ''){
            wx.showToast({
              title: '请填写商品原价',
              
              mask: true,
              
              duration: 500
              
            })
            return;
          }
          if(e.detail.value.price == ''){
            wx.showToast({
              title: '请填写商品售价',
              
              mask: true,
              
              duration: 500
              
            })
            return;
          }
          if(e.detail.value.pgoods_storage == ''){
            wx.showToast({
              title: '请填写商品库存',
              
              mask: true,
              
              duration: 500
              
            })
            return;
          }
          // if(e.detail.value.cid == ''){
          //   wx.showToast({
          //     title: '请选择商品类型',
              
          //     mask: true,
              
          //     duration: 500
              
          //   })
          //   return;
          // }
          if(html == ''){
            wx.showToast({
              title: '请填写商品详情',
              
              mask: true,
              
              duration: 500
              
            })
            return;
          }
          
          wx.showToast({
            title: '正在上传...',
            
            icon: 'loading',
            
            mask: true,
            
            duration: 500
            
          })
          // for(var i=0;i<imagesList.length;i++){
          //   wx.uploadFile({
          //     url: 'https://jx.huachenedu.cn/public/index.php/api/upload/uploads',
              
          //     filePath: imagesList[i],
              
          //     name: 'file',
              
          //     header: {
          //     "Content-Type": "multipart/form-data",
              
          //     'Content-Type': 'application/json'
              
          //     },
              
          //     success:function(data){
          //       var res = JSON.parse(data.data);
          //       if(res.code == 0){
          //         images += res.data + ',';
          //       }
          //       console.log(images);
          //     },
              
          //     fail:function(data){
          //     console.log(data);
              
          //     }
              
          //   })
          // }
          setTimeout(function(){
            var p = {
              pgoods_id: that.data.pgoods_id,
              pgoods_name: e.detail.value.pgoods_name,
              pgoods_price: e.detail.value.pgoods_price,
              price: e.detail.value.price,
              limit_price: e.detail.value.limit_price,
              pgoods_storage: e.detail.value.pgoods_storage,
              pgoods_body: html,
              cid: e.detail.value.cid,
            };
            App._post_form('Apis/prod_edit', p, function (result) {
              if (result.code === 0) {
                wx.navigateBack({
                  delta: 1
                })
              } else {
                App.showError(result.msg);
              }
            });
          },2000)
        }
      })
    },
})