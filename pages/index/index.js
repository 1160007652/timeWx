// index.js
// 获取应用实例
const dayjs = require('dayjs')
const isBetween = require('../../utils/isBetween')

dayjs.extend(isBetween);

const app = getApp()

Page({
  data: {
    currentProject: null, // 当前选中的项目
    timeInterval: 30, // 时间间隔
    meetingDateList: [ // 项目列表
      {
        "id": 109,
        "projectId": "359c7810-e112-424b-96f6-389f2840e62d",
        "startTime": "2020-07-20 12:00:00",
        "endTime": "2020-02-01 08:00:00"
      },
      {
        "id": 110,
        "projectId": "359c7810-e112-424b-96f6-389f2840e62d",
        "startTime": "2021-07-26 12:00:00",
        "endTime": "2021-07-30 08:00:00"
      },
      {
        "id": 111,
        "projectId": "359c7810-e112-424b-96f6-389f2840e62d",
        "startTime": "2021-09-15 12:00:00",
        "endTime": "2022-08-20 08:00:00"
      },
      {
        "id": 112,
        "projectId": "359c7810-e112-424b-96f6-389f2840e62d",
        "startTime": "2022-08-22 12:00:00",
        "endTime": "2022-08-30 08:00:00"
      },
    ],
    currentDate: '请选择日期', // 当前项目的预约日期
    currentTime: '请选择时间', // 当前项目的预约时间 区间
  },

  /**
   * 选择日前事件
   */
  bindPickerChangeDate(e) {
    const index = e.detail.value;
    const currentDate = this.data.currentProject.rangeDate[index];
    this.formatTime(currentDate);
    this.setData({
      currentDate
    })
  },

  /**
   * 选择时间事件
   */
  bindPickerChangeTime(e){
    const index = e.detail.value;
    const currentTime = this.data.currentProject.rangeTime[index];
    this.setData({
      currentTime
    })
  },

  onReady() {
    this.formatMeetingDateList();
  },

  /**
   * 根据日期格式化时间，判断不同日期的开始、结束时间，并且循环出时间间隔列表
   * @param {string} selectDate 选中的日期 , 格式: YYYY-MM-DD
   */
  formatTime(selectDate) {
    const currentProject = this.data.currentProject;
    const timeInterval = this.data.timeInterval;

    /**
     * 提取不同日期的时间开始、结束数据
     * 
     * 如果无对应日期数据，使用默认值 startTime: '00:00:00', endTime: '24:00:00'
     **/ 

    let {
      startTime,
      endTime
    } = currentProject.dateTimeMap[selectDate] || {
      startTime: '00:00:00',
      endTime: '24:00:00'
    };

    startTime = dayjs(`${selectDate} ${startTime}`, 'YYYY-MM-DD HH:mm:ss');

    endTime = dayjs(`${selectDate} ${endTime}`, 'YYYY-MM-DD HH:mm:ss');

    console.log(endTime.format('YYYY-MM-DD HH:mm:ss'))

    let currentTime = startTime;


    let rangeTime = [];

    while (currentTime.isBetween(startTime.format('YYYY-MM-DD HH:mm:ss'), endTime.format('YYYY-MM-DD HH:mm:ss'), 'minutes', '[]')) {

      const tmpTime = currentTime.format('HH:mm:ss');
      currentTime = currentTime.add(timeInterval, "minutes");


      if (currentTime.format('HH:mm:ss') === '00:00:00') {
        rangeTime.push(`${tmpTime} ~ 24:00:00`)
        break;
      } else {
        rangeTime.push(`${tmpTime} ~ ${currentTime.format('HH:mm:ss')}`)

      }
    }

    currentProject.rangeTime = rangeTime;

    this.setData({
      currentProject
    })
  },

  /**
   * 将 meetingDateList 初始项目数据，转化为符合项目结构的数据
   */
  formatMeetingDateList() {

    // 最终使用的数据结构
    const currentProject = {
      projectId: '', // 项目ID
      rangeDate: [], // 日期范围
      rangeTime: [], // 时间范围，只会在选中日期后才会挂载对应的日期的时间数据。
      dateTimeMap: { // 日期与日期对应的时间映射表，只存放 日期开始时间非（00:00:00～24:00:00）的数据
        date: []
      }
    };

    this.data.meetingDateList.forEach((item) => {
      const startTime = dayjs(item.startTime);
      const endTime = dayjs(item.endTime);
      let currentDate = startTime;
      const rangeDate = [];

      if (startTime.isSame(endTime, 'day')) {
        const dateTimeMap = currentProject.dateTimeMap[startTime.format('YYYY-MM-DD')];
        currentProject.rangeTime[startTime.format('YYYY-MM-DD')] = {
          ...dateTimeMap,
          startTime: startTime.format('HH:mm:ss'),
          endTime: endTime.format('HH:mm:ss')
        };
      } else {
        currentProject.dateTimeMap[startTime.format('YYYY-MM-DD')] = {
          startTime: startTime.format('HH:mm:ss'),
          endTime: '24:00:00'
        };

        currentProject.dateTimeMap[endTime.format('YYYY-MM-DD')] = {
          startTime: '00:00:00',
          endTime: endTime.format('HH:mm:ss')
        };
      }

      while (currentDate.isBetween(startTime.format('YYYY-MM-DD'), endTime.format('YYYY-MM-DD'), 'day', '[]')) {

        rangeDate.push(currentDate.format('YYYY-MM-DD'))
        currentDate = currentDate.add(1, "day");

      }

      currentProject.projectId = item.projectId;
      currentProject.rangeDate = currentProject.rangeDate.concat(rangeDate);

    })

    this.setData({
      currentProject
    })

  },
  onLoad() {

  },

})