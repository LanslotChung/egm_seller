// pages/backlogList/backlogList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    visitorList:[],
    id:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    if(options.id == 1){
      this.setData({
        title:'今日待回访'
      })
    }else if(options.id == 2){
      this.setData({
        title:'今日待看房'
      })
    }else if(options.id == 3){
      this.setData({
        title:'今日待签约'
      })
    }else if(options.id == 4){
      this.setData({
        title:'今日待成交'
      })
    }else if(options.id == 5){
      this.setData({
        title:'其他事项'
      })
    }
    this.getTodoList()
  },
  getTodoList:function(){
    wx.request({
      url: app.globalData.url + '/adviser/todoList',
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        token: app.globalData.userInfo.token,
        projectId: app.globalData.userInfo.projectId,
        type:this.data.id
      },
      success: (res) => {
        if(res && res.data.code == 1000){
          this.setData({
            visitorList:res.data.data
          })
        }
      }
    })
  },
  callPhone:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.id
    })
  },
  finishFn:function(e){
    wx.showModal({
      title: '提示',
      content: '确认完成?',
      success :(res)=> {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/adviser/modifyDealStatus',
            method:"post",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
              id: this.data.visitorList[e.currentTarget.dataset.index].id
            },
            success: (res) => {
              console.log(res)
              if(res && res.data.code == 1000){
                this.data.visitorList.splice(e.currentTarget.dataset.index,1);
                this.setData({
                  visitorList:this.data.visitorList
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})