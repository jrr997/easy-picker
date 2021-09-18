// index.js
// 获取应用实例
const app = getApp()

Page({
  onTimeChange(e) {
    console.log(e.detail);
    this.setData({
      time: e.detail.time
    })
  }
})
