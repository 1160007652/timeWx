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
        "endTime": "2021-02-01 08:00:00"
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
    startTimeLimit: '00:00', // 开始限制时间
    endTimeLimit: '00:00', // 结束限制时间
  },

  bindPickerChange(e) {
    const projectData = this.data.meetingDateList[e.detail.value];
    this.initData(projectData);
  },

  initData(projectData) {
    // 切换项目对应的时间 分段
    this.setData({
      currentProject: projectData
    })

    const dateTime = projectData.startTime.split(' ');

    // 初始化 当前选中的 默认日期
    this.setCurrentDate(dateTime[0], projectData);

    // 初始化当前选中日期的 时间限制
    this.initTimeLimit(projectData, dateTime[0])

    // 初始化 当前选中的 默认时间
    this.setCurrentTime(dateTime[0], dateTime[1], projectData);
  },

  /**
   * 设置时间限制
   * @param {object} projectData 当前操作的项目
   * @param {string} currentDate 当前选中的日期
   */
  initTimeLimit(projectData, currentDate) {
    const startDateTime = projectData.startTime.split(' ');
    const _startTimeLimit = startDateTime[0] === currentDate ? startDateTime[1] : '00:00:00'

    const endDateTime = projectData.endTime.split(' ');
    const _endTimeLimit = endDateTime[0] === currentDate ? endDateTime[1] : '24:00:00';

    this.setData({
      startTimeLimit: _startTimeLimit,
      endTimeLimit: _endTimeLimit,
    });
  },

  /**
   * 封装·设置时间的方法
   * @param {string} currentDate 当前选中日期
   * @param {string} currentTime 当前选中时间
   * @param {obejct} project 当前选中项目 
   */
  setCurrentTime(currentDate, currentTime, projectData) {
    console.log(currentDate, currentTime, projectData);
    // 当前时间
    let startTime = new Date(`${currentDate} ${currentTime}`);
    const startTimeStamp = Date.parse(startTime.toString());

    // 时间间隔的开始时间 < 项目时间的开始时间，采用项目的开始时间
    if (startTimeStamp <= Date.parse(projectData.startTime)) {
      startTime = new Date(projectData.startTime);
    }

    let startTimeView = `${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()} `;

    // 结束时间
    let endTime = startTime;
    // 获取当前分钟数
    const min = endTime.getMinutes();
    // 当前分钟 + 时间间隔（默认30分钟）
    endTime.setMinutes(min + this.data.timeInterval);

    // 结束时间的时间戳
    const endTimestamp = Date.parse(endTime.toString());

    // 时间间隔的结束时间 <= 项目时间的结束时间，采用时间间隔的结束时间
    let endTimeView = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()} `;

    // 时间间隔的结束时间 > 项目时间的结束时间，采用项目的结束时间
    if (endTimestamp > Date.parse(projectData.endTime)) {
      endTime = new Date(projectData.endTime);
      endTimeView = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()} `;

      endTime.setMinutes(endTime.getMinutes() - this.data.timeInterval);

      startTimeView = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()} `;

    }

    this.setData({
      currentTime: `${startTimeView} ~ ${endTimeView}`
    })

  },
/**
 * 设置日期
 * @param {string} currentDate 当前选中的日期
 * @param {object} projectData 当前操作的项目
 */
  setCurrentDate(currentDate, projectData){
    const currentTimeStamp = Date.parse(currentDate);
    const startDateTimeStamp = Date.parse(projectData.startTime);
    const endDateTimeStamp = Date.parse(projectData.endTime);

    let _currentDate = currentDate;
    if(currentTimeStamp < startDateTimeStamp) {
      _currentDate = projectData.startTime.split(' ')[0];
    } else if (currentTimeStamp > endDateTimeStamp){
      _currentDate = projectData.endTime.split(' ')[0];
    } else {
      _currentDate = currentDate;
    }

    this.setData({currentDate: _currentDate});
  },


  // 日期区间改变
  handleOnChangeCurrentDate(e) {
    const projectData = this.data.currentProject;
    // 设置当前选中的日期
    this.setCurrentDate(e.detail.value, projectData);

    // 设置当前选中日期的 时间限制
    this.initTimeLimit(projectData, e.detail.value)

     // 设置当前选中的时间
     this.setCurrentTime(e.detail.value, projectData.startTime.split(' ')[1], projectData);

  },


  // 时间区间改变
  handleOnChangeCurrentTime(e) {

    const currentTime = e.detail.value;

    // 初始化 当前选中的 默认时间
    this.setCurrentTime(this.data.currentDate, currentTime, this.data.currentProject);
  },
  onReady() {
    // 初始化页面，默认选中数据
    
    // this.initData(projectData);

    this.formatMeetingDateList();


  },

  formatMeetingDateList(){


    const currentProject = {projectId: '', rangeDate:[],rangeTime:{date: []}};

    this.data.meetingDateList.forEach((item)=>{
      const startTime = dayjs(item.startTime);
      const endTime = dayjs(item.endTime);
      let currentDate = startTime;
      const rangeDate = [];


      if (currentDate.isSame(startTime)){
        currentProject.rangeTime[currentDate.format('YYYY-MM-DD')]=startTime.format('HH:mm:ss');
      }

      while(currentDate.isBetween(startTime.format('YYYY-MM-DD'), endTime.format('YYYY-MM-DD'), 'day', '[]')) {
        
        rangeDate.push(currentDate.format('YYYY-MM-DD'))
        currentDate = currentDate.add(1, "day");

      }

        currentProject.projectId = item.projectId;
        currentProject.rangeDate = currentProject.rangeDate.concat(rangeDate);

        


        // currentProject.rangeTime[rangeDate]= ''
    })

    console.log(currentProject)

  },
  onLoad() {

  },

})