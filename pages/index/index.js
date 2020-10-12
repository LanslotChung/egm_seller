//index.js
//获取应用实例
const app = getApp()
// const utils = require('../../utils/util.js');
Page({
  data: {
    indexInfo:null,
    currentProductName:"",
    scrollViewH:app.globalData.screenHeight - app.globalData.statusBarHeight - 100,
    refresherTriggered:false,
    cardPreviewDataShow:false,
    imgW:600,
    imgH:400
  },
  onLoad:function(){
    //获取首页数据
    this.getIndexInfo();
    this.cardPreview();
    this.getAllProducts();
  },  
  getIndexInfo:function(bl){
    wx.request({
      url: app.globalData.url + '/adviser/info',
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        token: app.globalData.userInfo.token,
        projectId: app.globalData.userInfo.projectId,
        pageSize:10,
        pageNum:1
      },
      success: (res) => {
        if (res.data && res.data.code == 1000){
          this.data.indexInfo = res.data.data;
          app.globalData.userInfo.adviserId = res.data.data.adviserId;
          this.setData({
            indexInfo: res.data.data
          })
          if(bl){
            this.setData({
              refresherTriggered: false,
            })
            this._freshing = false
          }
        }
      }
    })
  },
  getAllProducts:function(){
    wx.request({
      url: app.globalData.url + '/adviser/productList',
      method:"POST",
      header:{
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        token:app.globalData.userInfo.token
      },      
      success:(res) =>{
        if(res.data && res.data.code == 1000){
          app.globalData.productInfos=res.data.data
        }
      }
    })
  },
  chooseProduct:function(){
    if(app.globalData.productInfos.length > 1){
      wx.navigateTo({
        url: '/pages/ProductList/ProductList',
      })
    }
  },
  goOtherPrograms:function(){
    wx.navigateToMiniProgram({
      appId:'wx09eb9d792dcfae83',
      path:'/pages/index/index',
      envVersion:'develop',
      extraData:{
        adviserId:app.globalData.userInfo.adviserId,
        projectId:app.globalData.userInfo.projectId
      }
    })
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true;
    this.getIndexInfo(true);
  },
  onRestore:function(){
    wx.showToast({
      title: '刷新完成',
      icon: 'success',
      duration: 1000
    })
  },
  goCardPage(){
    this.setData({
      cardPreviewDataShow:true
    })
  },
  cardPreview:function(){
    let _this = this;
    wx.request({
      url: app.globalData.url + '/adviser/cardPreview',
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        adviserId: app.globalData.userInfo.adviserId,
        projectId: app.globalData.userInfo.projectId
      },
      success: (res) => {
        if (res.data && res.data.code == 1000){
          _this.setData({
            cardPreviewData:res.data.data
          })
          wx.getImageInfo({
            src: res.data.data.codeUrl,
            success:(e)=>{
              var w = 600;
              var h = w / e.width * e.height;
              _this.setData({
                imgW:w,
                imgH:h
              })
            }
          })
        }
      }
    })
  },
  hideBox3:function(){
    this.setData({
      cardPreviewDataShow:false
    })
  },
  saveCardPreview:function(){
    wx.showLoading({
      title: '保存中...'
    })
    wx.downloadFile({
      url: this.data.cardPreviewData.codeUrl,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath:res.tempFilePath,
            success(res) { 
              wx.hideLoading()
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail(err){
              console.log(err)
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
                console.log("当初用户拒绝，再次发起授权")
                wx.showModal({
                  title: '提示',
                  content: '需要您授权保存相册',
                  showCancel: false,
                  success: modalSuccess => {
                    wx.openSetting({
                      success(settingdata) {
                        console.log("settingdata", settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          wx.showModal({
                            title: '提示',
                            content: '获取权限成功,再次点击即可保存',
                            showCancel: false,
                          })
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '获取权限失败，将无法保存到相册哦~',
                            showCancel: false,
                          })
                        }
                      },
                      fail(failData) {
                        console.log("failData", failData)
                      },
                      complete(finishData) {
                        console.log("finishData", finishData)
                      }
                    })
                  }
                })
              }
            }
          })
        }
      },
      complete(res) {
        console.log(res);
        wx.hideLoading()
      }
    })
  }
})


