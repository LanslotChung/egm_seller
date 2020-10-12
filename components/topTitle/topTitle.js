// components/topTitle/topTitle.js
const app =getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String, // 简化的定义方式
    show: Boolean,
    entering:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gobackFn:function(){
      wx.navigateBack()
    },
    enteringFn:function(){
      this.triggerEvent('myevent')
    }
  }
})
