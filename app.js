//app.js
App({
  onLaunch: function (o) {
    // wx.login({
    //   success: res => {console.log(res)}
    // })
    wx.login({
      success: res => {
        wx.request({
          url: this.globalData.url + '/user/login',
          data: {
            code: res.code,
            roleType:2
          },
          success:(res)=>{
            console.log(res)
            //用户是否登录,如果已登录,globalData.userInfo有数据,否则无数据
            this.globalData.showIndex = true;
            this.globalData.userInfo = res.data.data;
            if (this.userInfoReadyCallback){
              this.userInfoReadyCallback();
            }
          }
        })
      }
    })
  },
  globalData: {
    showIndex:false,//控制首页回调
    userInfo: null,//用户信息
    url: 'https://xiecong123.online/egm',
    // url: 'http://192.168.3.7:8180/egm',
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],//获取状态栏高度
    screenHeight:wx.getSystemInfoSync()['screenHeight'],
    pixelRatio:wx.getSystemInfoSync()['pixelRatio'],
    productInfos:null
  }
})