const app = getApp();
Component({
  data: {
    selected: app.globalData.selected||0,
    color: "#9e9e9e",
    selectedColor: "#161616",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/imgs/sy1.png",
      selectedIconPath: "/imgs/sy.png",
      text: "首页"
    }, {
      pagePath: "/pages/visitor/visitor",
      iconPath: "/imgs/fk1.png",
      selectedIconPath: "/imgs/fk.png",
      text: "访客"
    },{
      pagePath: "/pages/client/client",
      iconPath: "/imgs/kh1.png",
      selectedIconPath: "/imgs/kh.png",
      text: "客户"
    },{
      pagePath: "/pages/backlog/backlog",
      iconPath: "/imgs/db1.png",
      selectedIconPath: "/imgs/db.png",
      text: "待办"
    }]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})