// pages/visitorDetails/visitorDetails.js
import * as echarts from '../../components/ec-canvas/echarts';
const app = getApp();
function setOption(chart,data) {
  var option = {
    yAxis: {
        type: 'category',
        data: data.map(function(v){
          return v.houseType
        }),
        nameLocation:'middle',
        nameTextStyle:{
          fontSize:8,
          verticalAlign:'middle'
        }
    },
    xAxis: {
        type: 'value'
    },
    series: [{
        data: data.map(function(v){
          return v.num
        }),
        type: 'bar',
        // itemStyle:{
        //   color:'#f59a23'
        // }
        itemStyle: {
          normal: {
              color: function(params) {
                  let colorList = [
                                    "#f59a23",
                                    "#169bd5",
                                      // "#61a0a8",
                                      // "#546570"
                                  ];
                  return colorList[params.dataIndex%2];
              }
          }
        },
    }],
    grid: {
      left: 5,
      right: 10,
      bottom: 10,
      top: 10,
      containLabel: true
    },
  };
  chart.setOption(option);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitorDetails:null,
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    behaviorInfo:null,
    showBehavior:false,
    showUserHouseBrowsingList:false,
    canvasHeight:200,
    showBox4:false,
    sexs:[{
      key:0,
      txt:'未知'
    },{
      key:1,
      txt:'男'
    },{
      key:2,
      txt:'女'
    }],
    clientDegrees:[{
      key:0,
      txt:'高'
    },{
      key:1,
      txt:'中'
    },{
      key:2,
      txt:'低'
    }],
    clientSexsIndex:0,
    clientName:'',
    clientPhone:'',
    clientDegreeIndex:0,
    showBox5:false,
    visitorName:'',
    visitorSexIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let visitorDetails = JSON.parse(wx.getStorageSync('visitorDetails'));
    let index = 0;
    for(let i=0;i<this.data.sexs.length;i++){
      if(visitorDetails.sex == this.data.sexs[i].key){
        index = i;
      }
    }
    this.setData({
      visitorDetails:visitorDetails,
      clientName:visitorDetails.nickName,
      clientSexsIndex:index,
      clientPhone:visitorDetails.mobile
    })
  },
  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
  },
  getEditUserInfo:function(){
    wx.request({
      url: app.globalData.url + '/adviser/editUserInfo',
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        userId: this.data.visitorDetails.userId,
        projectId: this.data.visitorDetails.projectId,
      },
      success: (res) => {
        console.log(res)
        if (res.data && res.data.code == 1000){
          this.setData({
            behaviorInfo: res.data.data,
            showBehavior:true
          })
          if(res.data.data.userHouseBrowsingList.length>0){
            this.setData({
              canvasHeight:res.data.data.userHouseBrowsingList.length/2*100+100
            })
            this.ecComponent.init((canvas, width, height, dpr) => {
              // 获取组件的 canvas、width、height 后的回调函数
              // 在这里初始化图表
              const chart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
              });
              setOption(chart,res.data.data.userHouseBrowsingList);
              // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
              this.chart = chart;
              //this.getimage(chart);
              // 注意这里一定要返回 chart 实例，否则会影响事件处理等
              return chart;
            });
          }
        }
      }
    })
  },
  showAddClicentFn:function(){
    let visitorDetails = JSON.parse(wx.getStorageSync('visitorDetails'));
    let index = 0;
    for(let i=0;i<this.data.sexs.length;i++){
      if(visitorDetails.sex == this.data.sexs[i].key){
        index = i;
      }
    }
    this.setData({
      clientName:visitorDetails.nickName,
      clientSexsIndex:index,
      clientPhone:visitorDetails.mobile,
      clientDegreeIndex:2,
      showBox4:true
    })
  },
  inputClientNameFn:function(e){
    this.setData({
      clientName:e.detail.value
    })
  },
  bindsexPickerChange:function(e){
    console.log(e.detail.value)
    this.setData({
      clientSexsIndex:e.detail.value
    })
  },
  bindDegreePickerChange:function(e){
    console.log(e.detail.value)
    this.setData({
      clientDegreeIndex:e.detail.value
    })
  },
  hideClicentFn:function(){
    this.setData({
      showBox4:false
    })
  },
  addClicentFn:function(){
    wx.request({
      url: app.globalData.url + '/adviser/modifyVisitor',
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        visitorId: this.data.visitorDetails.id,
        intentional:this.data.clientDegrees[this.data.clientDegreeIndex].key,
        username:this.data.clientName,
        sex:this.data.sexs[this.data.clientSexsIndex].key
      },
      success: (res) => {
        if(res && res.data.code == 1000){
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1000
          })
          let pages = getCurrentPages();
          let visitorDetailsIndex = wx.getStorageSync('visitorDetailsIndex');
          pages[pages.length-2].data.visitorList.splice(visitorDetailsIndex,1);
          //缓存一条数据提示刷新客户列表
          wx.setStorageSync('addclient',1);
          wx.switchTab({
            url: '/pages/client/client'
          })
        }else{
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 1000
          })
        }
        console.log(res)
      }
    })
  },
  showEditInfoFn:function(){
    let visitorDetails = JSON.parse(wx.getStorageSync('visitorDetails'));
    let index = 0;
    for(let i=0;i<this.data.sexs.length;i++){
      if(visitorDetails.sex == this.data.sexs[i].key){
        index = i;
      }
    }
    this.setData({
      visitorName:visitorDetails.nickName,
      visitorSexIndex:index,
      showBox5:true
    })
  },
  inputvisitorNameFn:function(e){
    this.setData({
      visitorName:e.detail.value
    })
  },
  bindvisitorSexPickerChange:function(e){
    this.setData({
      visitorSexIndex:e.detail.value
    })
  },
  hideVisitorFn:function(){
    this.setData({
      showBox5:false
    })
  },
  editVisitorFn:function(){
    wx.request({
      url: app.globalData.url + '/adviser/modifyVisitorLevelOrSource',
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        visitorId: this.data.visitorDetails.id,
        username:this.data.visitorName,
        sex:this.data.sexs[this.data.visitorSexIndex].key,
        source:1
      },
      success: (res) => {
        if(res && res.data.code == 1000){
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1000
          })
          this.data.visitorDetails.nickName = this.data.visitorName;
          this.data.visitorDetails.sex = this.data.sexs[this.data.visitorSexIndex].key;
          this.setData({
            visitorDetails:this.data.visitorDetails,
            showBox5:false
          })
          wx.setStorageSync('visitorDetails',JSON.stringify(this.data.visitorDetails));
          let pages = getCurrentPages();
          let visitorDetailsIndex = wx.getStorageSync('visitorDetailsIndex');
          pages[pages.length-2].data.visitorList[visitorDetailsIndex].nickName = this.data.visitorName;
          pages[pages.length-2].data.visitorList[visitorDetailsIndex].sex = this.data.sexs[this.data.visitorSexIndex].key;
        }else{
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 1000
          })
        }
        console.log(res)
      }
    })
  }
})