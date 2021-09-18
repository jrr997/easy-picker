// components/supertimePicker/supertimePicker.js
const date = new Date()
let temArray = []
for (let i = 0; i< 10; i++) {
  temArray.push(`0${i}`)
}
// 初始化数据
const years = createArray(1980, date.getFullYear() + 10)
const months = createArray(1, 12)
let days = createArray(1, 31)
const hours = createArray(0, 23)
const minutes = [...temArray].concat(createArray(10, 59))
const seconds = [...temArray].concat(createArray(10, 59))
temArray = null
let chosenArray = [date.getFullYear() - 1980, date.getMonth(), date.getDate() - 1]

const modeMap = ['year', 'month', 'day', 'hour', 'minute', 'second']

Component({
  properties: {
    mode: String
  },
  data: {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    chosenArray // 已选时间的index
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @param {Array} pickerArray 数组元素是已选时间的index
     * @returns {Array<Array>} 表示已选时间的二维数组[[year,month,day],[hour,minute,hour]]
     */
    getTransArray(pickerArray) {
      let [yearIndex, monthIndex, dayIndex, ...rest] = pickerArray
      return [
        [this.data.years[yearIndex], monthIndex + 1, dayIndex + 1],
        [rest[0] || 0, this.data.minutes[rest[1]] || '00', this.data.seconds[rest[2]] || '00']
      ]
    },
    pickerChange(e) {
      const value = e.detail.value // 表示已选时间的数组
      if (value.length >= 3 && (value[0] !== this.data.chosenArray[0] || 
        value[1] !== this.data.chosenArray[1])){ // 只有变化的是年或月才需要重新计算days
        // TODO 排除时分秒选择器
        let [choosenYear, choosenMonth, ...rest] = this.getTransArray(value)[0]
          console.log(choosenMonth,choosenYear);
        const dayNum = getDay(choosenMonth, choosenYear)
        if (dayNum !== this.data.days.length) { // 新值不等于旧值时才改变days数组
          const newDays = createArray(1, dayNum)
          this.setData({
            chosenArray: value,
            days: newDays
          })
        }
        this.setData({
          chosenArray: value,
        })
      }

      // 发出change事件
      // 根据mode暴露detail
      const [front, back] = this.getTransArray(value)
      const detail = {
        timeArray: [...front, ...back].slice(0, value.length),
        timeIndex: value,
        time: front.join('-') + ' ' + back.join(':'),
        e
      } 
      this.triggerEvent('timeChange', detail)
    }
  },
  lifetimes: {
    attached() {
      // 根据mode渲染picker
      let isShownColumn
      switch (this.properties.mode) {
        case 'year':
          isShownColumn = [1,0,0,0,0,0]
          break;
          case 'month':
          isShownColumn = [1,1,0,0,0,0]
            break;
          case 'day':
            isShownColumn = [1,1,1,0,0,0]
            break;
          case 'hour':
            isShownColumn = [1,1,1,1,0,0]
            break;
          case 'minute':
            isShownColumn = [1,1,1,1,1,0]
            break;
          case 'second':
            isShownColumn = [1,1,1,1,1,1]
            break;
        default:
          isShownColumn = [1,1,1,0,0,0]
          console.warn(`easyPicker异常，mode:"${this.properties.mode}"的值错误，请传入正确的值！`)
          break;
      }

      // TODO 默认已选时间 默认选择器范围
      this.setData({
        isShownColumn
      })
    }
  }
})

 /**
  *  根据年月判断日
  *  @params {Number} month 必须
  *  @params {Number} year 只有month为2时要求year必传,其余不传
  *  @return {Number} days
  */
function getDay(month= 1, year= null ) {
  month = Number(month)
  let days
  if (month === 2) {
    if (!year) {
      console.warn(`getDay方法的第二个参数必须为Number类型！目前是${year}`)
      return 0
    }
    year = Number(year)
    days = isLeapYear(year) ? 29 : 28
  } else if([1, 3, 5, 7, 8, 10, 12].includes(month)){ // 大月
    days = 31
  } else { // 小月
    days = 30
  }
  return days
}

 /**
  *  判断是否闰年
  *  @params {Number} year
  *  @return {Boolean} 
  */
function isLeapYear(year) {
  // 闰年的规律：四年一闰,百年不闰,四百年再闰
  // 能被4整除，且不能被100整除 || 同时能被4和400整除
  return  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

/** 创建连续数组 */
function createArray(from, to, prefix) {
  let array = []
 for(; from<=to; from++) {
  array.push(from)
 }
 return array
}

