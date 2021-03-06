// pages/order/list/list.js
const util = require('../../../utils/util.js')

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabClasss: [],
    status: ['ALL','WAITPAY','WAITSEND','WAITRECEIVE','FINISH'],
    stautsDefault: 'ALL',
    page: 1, //默认加载第1页
    orders: [],
    domain: app.globalData.domain,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      tabClasss: ['text-select', 'text-normal', 'text-normal', 'text-normal', 'text-normal']
    })
    this.getOrderList(this.data.stautsDefault,1)
  },

  tabClick: function(e){
    var index = e.currentTarget.dataset.index
    var status = this.data.status
    var classs = ['text-normal', 'text-normal', 'text-normal', 'text-normal', 'text-normal']
    classs[index] = 'text-select'
    this.setData({
      tabClasss: classs,
      stautsDefault: status[index],
      orders: [],
      page: 1
    })
    this.getOrderList(status[index], 1)
  },

  //默认加载全部订单数据
  getOrderList: function(status, page) {
    var url = 'User/getOrderList'
    var params = {
      status: status,
      page: page,
      openid: app.globalData.openid,
      token: app.globalData.userInfo.token
    }
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        // console.log(data)
        var goods = data.info.data
        var orders = this.data.orders
        for(var i in goods){
          orders.push(goods[i])
        }
        wx.stopPullDownRefresh()
        this.setData({ orders: orders })
      } else {
        app.globalData.login = false
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
    }, data => { }, data => { })
  },

  //取消订单
  cancel: function(e) {
    var oid = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          var url = 'User/cancelOrder'
          var params = {
            oid: oid,
            openid: app.globalData.openid,
            token: app.globalData.userInfo.token
          }
          util.wxRequest(url, params, data => {
            if (data.code == 200) {
              wx.showToast({
                title: '订单成功取消',
                icon: 'success'
              })
              that.setData({ orders:[], page:1 })
              that.getOrderList(that.data.stautsDefault, 1)
            } else {
              app.globalData.login = false
              wx.showToast({
                title: data.msg,
                icon: 'none'
              })
            }
          }, data => { }, data => { })
        }
      }
    })
  },

  //确认收货
  confirm: function (e) {
    var oid = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定收货吗？',
      success: function (res) {
        if (res.confirm) {
          var url = 'User/confirmOrder'
          var params = {
            oid: oid,
            openid: app.globalData.openid,
            token: app.globalData.userInfo.token
          }
          util.wxRequest(url, params, data => {
            if (data.code == 200) {
              wx.showToast({
                title: '订单收货成功',
                icon: 'success'
              })
              that.setData({ orders: [], page: 1 })
              that.getOrderList(that.data.stautsDefault, 1)
            } else {
              app.globalData.login = false
              wx.showToast({
                title: data.msg,
                icon: 'none'
              })
            }
          }, data => { }, data => { })
        }
      }
    })
  },

  //立即付款
  pay: function(e){
    var index = e.currentTarget.dataset.index
    var order = this.data.orders[index]
    app.globalData.order = order
    wx.navigateTo({
      url: '../pay/pay',
    })
  },

  //查看订单
  details: function(e) {
    //订单ID
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../details/details?orderId=' + id
    })
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
   * 页面相关事件处理函数--监听用户下拉动作--刷新
   */
  onPullDownRefresh: function () {
    this.setData({ orders:[], page:1})
    this.getOrderList(this.data.stautsDefault, 1)
  },

  /**
   * 页面上拉触底事件的处理函数--上拉加载
   */
  onReachBottom: function () {
    this.getOrderList(this.data.stautsDefault, ++this.data.page)
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})