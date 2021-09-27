// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    isPickerShow: true,
    startTime: '',
    endTime: '',
    showDate: ''
  },
  onConfirm(e) {
    console.log(e.detail);
    this.setData({
      isPickerShow: false,
      showDate: e.detail.startTime.split(' ')[0] + '至' + e.detail.endTime.split(' ')[0]
    })
  },
  onCancel() {
    this.setData({
      isPickerShow: false
    })
  },
  btnClick() {
    !this.data.isPickerShow && this.setData({isPickerShow: true})
  }
})
