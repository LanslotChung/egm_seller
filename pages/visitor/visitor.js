// pages/visitor/visitor.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollViewH:app.globalData.screenHeight - app.globalData.statusBarHeight - 100,
    refresherTriggered:false,
    pageNum:1,
    pageSize:10,
    userType:1,
    visitorList:[],
    total:0,
    loading: true,
    finish: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVisitorList()
  },
  onShow:function(){
    this.setData({
      visitorList:this.data.visitorList
    })
  },
  getVisitorList:function(bl){
    wx.request({
      url: app.globalData.url + '/adviser/visitorList',
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        token: app.globalData.userInfo.token,
        projectId: app.globalData.userInfo.projectId,
        pageSize:this.data.pageSize,
        pageNum:this.data.pageNum,
        userType:this.data.userType
      },
      success: (res) => {
        console.log(res)
        this.setData({
          loading: false,
        })
        if (res.data && res.data.code == 1000){
          if (this.data.pageNum == 1) {
            this.setData({
              visitorList: res.data.data,
              total: res.data.total
            })
          } else {
            this.setData({
              visitorList: this.data.visitorList.concat(res.data.data),
              total: res.data.total
            })
          }
          if(bl){
            this.setData({
              refresherTriggered: false,
            })
            this._freshing = false
          }
          if (this.data.total / this.data.pageSize <= this.data.pageNum) {
            this.setData({
              finish: true
            })
          }
        }
      }
    })
  },
  onscrolltolower:function(){
    if (this.data.total / this.data.pageSize > this.data.pageNum) {
      this.setData({
        pageNum: this.data.pageNum + 1,
        loading: true,
      })
      this.getVisitorList();
    } else {
      this.setData({
        loading: false,
        finish: true
      })
    }
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true;
    this.setData({
      pageNum:1,
      finish: false
    })
    this.getVisitorList(true);
  },
  onRestore:function(){
    wx.showToast({
      title: '刷新完成',
      icon: 'success',
      duration: 1000
    })
  },
  callPhone:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.id
    })
  },
  goVisitorDetails:function(e){
    let data = JSON.stringify(this.data.visitorList[e.currentTarget.dataset.index])
    wx.setStorageSync('visitorDetails', data);
    wx.setStorageSync('visitorDetailsIndex', e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '/pages/visitorDetails/visitorDetails',
    })
  }
})