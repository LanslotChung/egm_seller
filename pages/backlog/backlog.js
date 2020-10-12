// pages/backlog/backlog.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todoTotalList:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.getTodoList()
    this.getTodoTotalList()
  },
  getTodoTotalList:function(){
    wx.request({
      url: app.globalData.url + '/adviser/todoTotalList',
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        token: app.globalData.userInfo.token,
        projectId: app.globalData.userInfo.projectId
      },
      success: (res) => {
        console.log(res)
        if(res && res.data.code == 1000){
          this.setData({
            todoTotalList:res.data.data
          })
        }
      }
    })
  },
  goBacklogList:function(e){
    wx.navigateTo({
      url: '/pages/backlogList/backlogList?id='+e.currentTarget.dataset.id,
    })
  }
})