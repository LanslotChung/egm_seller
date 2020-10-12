// pages/ProductList.js
const app = getApp();
Page({
  data: {
    productList:null,
    shortAddrs:[],
    expireStatus:[]
  },
  onLoad: function (options) {
    this.getAllProductInfo();
    console.log(app.globalData.productInfos)
  },
  getAllProductInfo : function(){          
    this.setData({
      productList:app.globalData.productInfos
    })
    let _shortAddr = []
    let _expireStatus = []
    this.data.productList.forEach((item,index) => {
      var addrs = item.address.split("/");
      _shortAddr.push(addrs[1]);

      var expireTime = item.expireTime;
      var now = new Date();
       _expireStatus.push(now.getTime() > expireTime);
      // _expireStatus.push(true);
    });
    this.expireStatus = _expireStatus;
    this.setData({
      shortAddrs:_shortAddr,
      expireStatus:_expireStatus
    })
  },
  chooseProduct:function(e){
    if(app.globalData.userInfo.projectId == e.currentTarget.dataset.product){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }else if(!this.expireStatus[e.currentTarget.dataset.index]){
      app.globalData.userInfo.projectId = e.currentTarget.dataset.product;
      //app.globalData.userInfo.token = '9de8b0daa32f48db91066f48a9ec67ba';
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
})