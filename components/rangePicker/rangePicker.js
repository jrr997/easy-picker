/**
 * 日期范围选择器
 * TODO: 默认选择时间
 */

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '日期选择器'
    },
    pickerShow: {
      type: Boolean,
      observer:function(val){   //弹出动画
        // console.log(val);
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
    showEndTime: '',
    isTipsShow: false,
    tips: '请选择开始时间和结束时间' // tips内容
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
      })
    },
    onStartTimeChange(e) {
      console.log(e.detail);
      const date = e.detail.time.split(' ')[0] 
      this.setData({
        startTime: e.detail.time,
        showStartTime: date
      })
    },
    onEndTimeChange(e) {
      console.log(e.detail);
      const date = e.detail.time.split(' ')[0]
      this.setData({
        endTime: e.detail.time,
        showEndTime: date
      })
    },
    onConfirm() {
      console.log(this.data.startTime,this.data.endTime);
      if (this.data.startTime && this.data.endTime) {
        if (new Date(this.data.startTime).getTime() <= new Date(this.data.endTime).getTime()) {
          const detail = {
            startTime: this.data.startTime,
            endTime: this.data.endTime
          }
          this.setData({
            // pickerShow: false,
            isTipsShow: false,
          })
          this.triggerEvent('onConfirm', detail)
        } else { // 开始时间大于结束时间
          this.setData({
            tips: '开始时间必须小于结束时间',
            isTipsShow: true
          })
        }
      } else { // 没有选择开始时间或结束时间
        this.setData({
          tips: '请选择开始时间和结束时间',
          isTipsShow: true
        })
      }
    },
    onCancel() {
      this.triggerEvent('onCancel')
      this.setData({
        // pickerShow: false,
        isTipsShow: false
      })
    },
    hideModal() {
      this.setData({
        pickerShow: false
      })
    }
  },
  lifetimes: {
    detached() {
      console.log('datepicker detached');
    }
  }

})
