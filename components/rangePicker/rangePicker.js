// components/rangePicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pickerShow: {
      type: Boolean,
      observer:function(val){   //弹出动画
        // console.log(this.data);
        if(val){
          let animation = wx.createAnimation({
            duration: 500,
            timingFunction: "ease"
          });
          let animationOpacity = wx.createAnimation({
            duration: 500,
            timingFunction: "ease"
          });
          setTimeout(() => {
            animation.bottom(0).step();
            animationOpacity.opacity(0.7).step();
            this.setData({
              animationOpacity: animationOpacity.export(),
              animationData: animation.export()
            })
          }, 0);
        }else{
          let animation = wx.createAnimation({
            duration: 100,
            timingFunction: "ease"
          });
          let animationOpacity = wx.createAnimation({
            duration: 500,
            timingFunction: "ease"
          });
          animation.bottom(-320).step();
          animationOpacity.opacity(0).step();
          this.setData({
            animationOpacity: animationOpacity.export(),
            animationData: animation.export()
          });
        }

        // 在picker滚动未停止前点确定，会使startValue数组各项归零，发生错误，这里判断并重新初始化
        // 微信新增了picker滚动的回调函数，已进行兼容
        if(this.data.startValue&&this.data.endValue){
          let s = 0, e = 0;
          let conf = this.data.config;
          
          this.data.startValue.map(val => {
            if (val == 0) {
              s++
            }
          })
          this.data.endValue.map(val => {
            if (val == 0) {
              e++;
            }
          });
          let tmp={
            hour:4,
            minute:5,
            second:6
          }
          let n = tmp[conf.column];
          if (s>=n || e>=n) {
            this.initPick();
            this.setData({
              startValue: this.data.startValue,
              endValue: this.data.endValue,
            });
          }
        }
        

      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabIndex: 0,
    showStartTime: '',
    showEndTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabChange(e) {
      console.log(e);
      const index = e.target.dataset.type
      this.setData({
        tabIndex: e.target.dataset.type || 0
      }, () => {
        // if (this.data.tabIndex === 1) { // 开始切换到结束
        //   // 显示已选开始时间
        //   this.setData({
        //     showStartTime: this.data.startPickTime.slice(0, 10),
        //     // showEndTime: null
        //   }) 
        // } else { // 结束切换到开始
        //   this.setData({
        //     showEndTime: this.data.endPickTime.slice(0, 10),
        //     // showStartTime: null
        //   }) 
        // }
      })
    },
    onStartTimeChange(e) {
      console.log(e.detail);
      const date = e.detail.time.split(' ')[0] 
      this.setData({
        startTime: date,
        showStartTime: date
      })
    },
    onEndTimeChange(e) {
      console.log(e.detail);
      const date = e.detail.time.split(' ')[0] 
      this.setData({
        endTime: date,
        showEndTime: date
      })
    }
  },
  onConfirm() {
    if (this.data.showStartTime && this.data.showEndTime) {
      const detail = {
        startTime: this.data.showStartTime,
        endTime: this.data.showEndTime
      }
      this.triggerEvent('onConfirm', detail)
    } else {
      
    }
  },
})
