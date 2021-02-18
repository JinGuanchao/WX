//获取应用实例
// const app = getApp(), $ = require("../../utils/util"), api = require("../../utils/api");
// var WxParse = require('../../wxParse/wxParse.js');
let App = getApp();
Page({
  data:{
    array:[],
    total: 0
  },
  onLoad: function(options){
    var that = this;
    that.setData({
      goods_id: options.goods_id,
      goods_num: options.goods_num,
      order_type: options.order_type,
      limit_price: options.limit_price,
      type: options.type
    })
    that.coupon();
  },
  //我的优惠券
  coupon: function(){
    var that = this;
    App._post_form('Api/coupon',{member_id:wx.getStorageSync('uid')},function(res){
        var total = 0;
        for(var i=0;i<res.length;i++){
          total += res[i].coupon;
        }
        that.setData({
          box: res,
          totals: total
        })
    })
  },
  use: function(e){
    var that = this;
    if(that.data.total == 0){
      wx.showToast({
        title: '请选择优惠券',
      })
      return;
    }
    var array = that.data.array;
    var str = '';
    for (var i = 0; i < array.length; i++) {
      str += array[i].id + ',';
    }
    if(this.data.goods_id){
      wx.redirectTo({
        url: '../flow/checkout?goods_id='+this.data.goods_id+'&goods_num='+this.data.goods_num+'&order_type=buyNow&coupon='+this.data.total+'&type='+this.data.type+'&str='+str,
      })
    }else{
      wx.redirectTo({
        url: '../flow/checkout?order_type=cart&coupon='+this.data.total
      })
    }
    
  },
  select: function(e){
    var that = this;
    var box = that.data.box;
    var array = that.data.array;
    var newarray = {
      id: e.currentTarget.dataset.id,
      coupon: e.currentTarget.dataset.coupon,
      index: e.currentTarget.dataset.index
    };
    if(box[e.currentTarget.dataset.index].selected){
      for (var i = 0; i < array.length; i++) {
        if (array[i].id == e.currentTarget.dataset.id){
          array.splice(i, 1);
        }
      }
      box[e.currentTarget.dataset.index].selected = false;
    }else{
      if(that.data.total + e.currentTarget.dataset.coupon <= that.data.limit_price){
        array.push(newarray);
        box[e.currentTarget.dataset.index].selected = true;
      }else{
        wx.showToast({
          title: '已超出使用金额',
        })
      }
    }
    that.setData({
      box: box,
      array: array
    })
    that.total();
  },
  total: function(){
    var that = this;
    var array = that.data.array;
    var total = 0;
    for (var i = 0; i < array.length; i++) {
      total += array[i].coupon;
    }
    that.setData({
      total: total
    })
  }
})