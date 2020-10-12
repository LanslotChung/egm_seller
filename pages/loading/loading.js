// pages/loading/loading.js
const app = getApp()
Page({
  data: {
    loading:true,
    getUserInfoShow:false,
    getPhoneNumberShow:false,
  },
  onLoad: function (options) {
    //设置登录回调
    if (app.globalData.showIndex){
      if(app.globalData.userInfo){
        wx.switchTab({
          url:'/pages/index/index'
        })
      }else{
        wx.getSetting({// 获取用户信息
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              this.setData({
                getPhoneNumberShow: true,
              })
            }else{
              this.setData({
                getUserInfoShow: true
              })
            }
          }
        })
      }
    }else{
      app.userInfoReadyCallback = () => {
        //根据是否有token判断调用哪个接口去获取首页信息
        if (app.globalData.userInfo) {
          wx.switchTab({
            url:'/pages/index/index'
          })
        }else{
          wx.getSetting({// 获取用户信息
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                this.setData({
                  getPhoneNumberShow: true,
                })
              }else{
                this.setData({
                  getUserInfoShow: true
                })
              }
            }
          })
        }
      }
    }
  },
  cancelGetUserInfoFn:function(){
    this.setData({
      getUserInfoShow: false
    })
  },
  hideUserInfoFn:function(){
    this.setData({
      getUserInfoShow: false
    })
  },
  getuserinfoFn:function(e){
    if (e.detail && e.detail.rawData){
      this.setData({
        getPhoneNumberShow:true
      })
    }
  },
  cancelGetPhoneNumberFn: function () {
    this.setData({
      getPhoneNumberShow: false
    })
  },
  hidePhoneFn:function(){
    this.setData({
      getPhoneNumberShow: false
    })
  },
  getPhoneNumberFn:function(e){
    if (e.detail && e.detail.encryptedData) {
      wx.getSetting({// 获取用户信息
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                let rawData = res.rawData;
                let signature = res.signature;
                wx.login({
                  success: res => {
                    wx.request({
                      url: app.globalData.url + '/user/info',
                      data: {
                        code: res.code,
                        rawData: rawData,
                        encryptedData: e.detail.encryptedData,
                        iv: e.detail.iv,
                        signature: signature,
                        roleType:2
                      },
                      success: (res) => {
                        app.globalData.userInfo = res.data.data;
                        //用户是否登录,如果已登录,globalData.userInfo有数据,否则无数据
                        //如果有数据,记录用户行为,重新获取首页信息
                        if (app.globalData.userInfo){
                          wx.switchTab({
                            url:'/pages/index/index'
                          })
                        }
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  },
})