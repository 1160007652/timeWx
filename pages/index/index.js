// index.js
// 获取应用实例
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
  },
  bindPickerChange(e){
    const projectData = this.data.meetingDateList[e.detail.value];
    this.initData(projectData);
  },

  initData(projectData) {
    // 切换项目对应的时间 分段
    this.setData({currentProject: projectData})
   
    const dateTime = projectData.startTime.split(' ');

    // 初始化 当前选中的 默认日期
    this.setData({currentDate: dateTime[0]})

    // 初始化 当前选中的 默认时间
    this.setCurrentTime(dateTime[0], dateTime[1], projectData);
  },
  /**
   * 封装·设置时间的方法
   * @param {string} currentDate 当前选中日期
   * @param {string} currentTime 当前选中时间
   * @param {obejct} project 当前选中项目 
   */
  setCurrentTime(currentDate, currentTime, projectData ){
    console.log(currentDate, currentTime, projectData);
    // 当前时间
    let startTime = new Date(`${currentDate} ${currentTime}`);
    const startTimeStamp = Date.parse(startTime.toString());

    // 时间间隔的开始时间 < 项目时间的开始时间，采用项目的开始时间
    if(startTimeStamp <= Date.parse(projectData.startTime)){
      startTime = new Date(projectData.startTime);
    }

    const startTimeView = `${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()} `;

    // 结束时间
    let endTime = startTime;
    // 获取当前分钟数
    const min=endTime.getMinutes();
    // 当前分钟 + 时间间隔（默认30分钟）
    endTime.setMinutes(min+this.data.timeInterval);

    // 结束时间的时间戳
    const endTimestamp = Date.parse(endTime.toString());

    // 时间间隔的结束时间 <= 项目时间的结束时间，采用时间间隔的结束时间
    let endTimeView = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()} `;

    // 时间间隔的结束时间 > 项目时间的结束时间，采用项目的结束时间
    if(endTimestamp > Date.parse(projectData.endTime)){
      endTime = new Date(projectData.endTime);
      endTimeView = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()} `;
    }
    
    this.setData({currentTime: `${startTimeView} ~ ${endTimeView}`})

  },

  // 日期区间改变
  handleOnChangeCurrentDate(e){
    this.setData({
      currentDate: e.detail.value
    })
  },
  // 时间区间改变
  handleOnChangeCurrentTime(e){

    const currentTime = e.detail.value;

    // 初始化 当前选中的 默认时间
    this.setCurrentTime(this.data.currentDate, currentTime, this.data.currentProject);
  },
  onReady(){
    // 初始化页面，默认选中数据
    const projectData = this.data.meetingDateList[0];
    this.initData(projectData);
  },
  onLoad() {
    
  },
  
})
