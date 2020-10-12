// pages/client/client.js
const app = getApp();
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollViewH:app.globalData.screenHeight - app.globalData.statusBarHeight - 100,
    refresherTriggered:false,
    once:true,
    pageNum:1,
    pageSize:10,
    userType:2,
    visitorList:[],
    total:0,
    loading: true,
    finish: false,
    showBox0:false,
    customerTag:'',
    customerTagIndex:0,
    showBox4:false,
    sexs:[{
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
    clientName:'',
    clientSexsIndex:0,
    clientPhone:'',
    clientPhone1:'',
    clientDegreeIndex:0,
    showBox5:false,
    dealTime:utils.formatTime(new Date()),
    visitorListIndex:0,
    backlogTypes:[{
      key:1,
      txt:'回访'
    },{
      key:2,
      txt:'看房'
    },{
      key:3,
      txt:'签约'
    },{
      key:4,
      txt:'成交'
    },{
      key:5,
      txt:'其他'
    }],
    backlogIndex:0,
    backlogExplain:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(()=>{
      this.setData({
        once:false
      })
    },200)
    this.getVisitorList();
  },
  onShow:function(){
    this.setData({
      visitorList:this.data.visitorList
    })
    if(wx.getStorageSync('addclient') == 1 ){
      wx.setStorageSync('addclient',0);
      if(!this.data.once){
        this.setData({
          pageNum:1,
          pageSize:10,
          userType:2,
          total:0,
          loading: true,
          finish: false
        })
        this.getVisitorList();
      }
    }
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
  goClientDetails:function(e){
    let data = JSON.stringify(this.data.visitorList[e.currentTarget.dataset.index])
    wx.setStorageSync('clientDetails', data);
    wx.setStorageSync('clientDetailsIndex', e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '/pages/clientDetails/clientDetails',
    })
  },
  adduserLabelFn:function(e){
    this.setData({
      showBox0:true,
      customerTag:'',
      customerTagIndex:e.currentTarget.dataset.index
    })
  },
  inputCustomerTag:function(e){
    console.log(e)
    this.setData({
      customerTag:e.detail.value
    })
  },
  hideBox0:function(){
    this.setData({
      showBox0:false
    })
  },
  addCustomerTagFn:function(){
    if(this.data.customerTag == ''){
      wx.showToast({
        title: '请输入标签',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.request({
      url: app.globalData.url + '/adviser/addLabel',
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        visitorId: this.data.visitorList[this.data.customerTagIndex].id,
        labelContent:this.data.customerTag
      },
      success: (res) => {
        console.log(res)
        if(res && res.data.code == 1000){
          this.data.visitorList[this.data.customerTagIndex].userLabelList.push({
            labelContent:this.data.customerTag,
            id:res.data.data.id
          })
          this.setData({
            showBox0:false,
            visitorList:this.data.visitorList
          })
        }else{
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  enteringFn:function(){
    this.setData({
      showBox4:true,
      clientName:'',
      clientSexsIndex:0,
      clientPhone:'',
      clientPhone1:'',
      clientDegreeIndex:0,
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
  inputClientPhoneFn:function(e){
    this.setData({
      clientPhone:e.detail.value
    })
  },
  inputClientPhone1Fn:function(e){
    this.setData({
      clientPhone1:e.detail.value
    })
  },
  hideClicentFn:function(){
    this.setData({
      showBox4:false
    })
  },
  addClicentFn:function(){
    if(this.data.clientName == ''){
      wx.showToast({
        title: '请输入客户姓名',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if(this.data.clientPhone == '' || this.data.clientPhone != this.data.clientPhone1){
      wx.showToast({
        title: '两次输入手机号不一致',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + '/adviser/visitorAdd',
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        adviserId: app.globalData.userInfo.adviserId,
        projectId:app.globalData.userInfo.projectId,
        userName:this.data.clientName,
        sex:this.data.sexs[this.data.clientSexsIndex].key,
        mobile:this.data.clientPhone,
        intentional:this.data.clientDegrees[this.data.clientDegreeIndex].key,
      },
      success: (res) => {
        wx.hideLoading()
        console.log(res)
        if(res && res.data.code == 1000){
          this.setData({
            pageNum:1,
            pageSize:10,
            userType:2,
            total:0,
            loading: true,
            finish: false,
            showBox4:false
          })
          this.getVisitorList();
        }else{
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  addUserDeal:function(e){
    this.setData({
      showBox5:true,
      dealTime:utils.formatTime(new Date()),
      backlogIndex:0,
      backlogExplain:'',
      visitorListIndex:e.currentTarget.dataset.index
    })
  },
  bindDateChange:function(e){
    this.setData({
      dealTime: e.detail.value
    })
  },
  bindBacklogPickerChange:function(e){
    this.setData({
      backlogIndex: e.detail.value
    })
  },
  inputBacklogExplain:function(e){
    this.setData({
      backlogExplain:e.detail.value
    })
  },
  hideBox5Fn:function(){
    this.setData({
      showBox5:false,
    })
  },
  addBacklogFn:function(){
    wx.request({
      url: app.globalData.url + '/adviser/addUserDeal',
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        token: app.globalData.userInfo.token,
        projectId:app.globalData.userInfo.projectId,
        userId:this.data.visitorList[this.data.visitorListIndex].userId,
        dealTime:this.data.dealTime,
        explain:this.data.backlogExplain,
        type:this.data.backlogTypes[this.data.backlogIndex].key,
      },
      success: (res) => {
        console.log(res)
        if(res && res.data.code == 1000){
          this.setData({
            showBox5:false
          })
          wx.showToast({
            title: '添加成功',
            duration: 1000
          })
        }else{
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  removeLabelFn:function(e){
    console.log(e.currentTarget.dataset)

    let id = e.currentTarget.dataset.id;
    let index =  e.currentTarget.dataset.index;
    let idx = e.currentTarget.dataset.idx;
    wx.showModal({
      title: '提示',
      content: '确定要删除该标签吗?',
      success :(res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/adviser/removeLabel',
            method:"post",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
              id
            },
            success: (res) => {
              console.log(res)
              if(res && res.data.code == 1000){
                wx.showToast({
                  title: '删除成功',
                  duration: 1000
                })
                this.data.visitorList[index].userLabelList.splice(idx,1);
                this.setData({
                  visitorList:this.data.visitorList
                })
              }else{
                wx.showToast({
                  title: '操作失败',
                  icon: 'none',
                  duration: 1000
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