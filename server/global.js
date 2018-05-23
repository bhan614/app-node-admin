const {SERVER_URL, SSO_URL, UC_URL, PASSPORT_URL} = process.env;
const global = {};

global.URL_CONTEXT = ''; //二级目录名称

global.apis = {
  //战报头条
  newsList: `${SERVER_URL}/report/queryList`,
  deleteNews: `${SERVER_URL}/report/deleteReport`,
  addNews: `${SERVER_URL}/report/insertOrUpdate`,
  //轮播图管理
  getBannerNumber: `${SERVER_URL}/banner/getSort`,
  carouselList: `${SERVER_URL}/banner/queryList`,
  carouselUpload: `${SERVER_URL}/carousel/upload`,
  addCarousel: `${SERVER_URL}/banner/insertOrUpdate`,
  deleteCarousel: `${SERVER_URL}/banner/deleteBanner`,
  //公告管理
  noticeList: `${SERVER_URL}/announce/queryList`,
  deleteNotice: `${SERVER_URL}/announce/deleteAnnounce`,
  addNotice: `${SERVER_URL}/announce/insertOrUpdate`,
  //工作台管理
  workList: `${SERVER_URL}/desk/queryList`,
  deleteWork: `${SERVER_URL}/desk/deleteDesk`,
  addWork: `${SERVER_URL}/desk/insertOrUpdate`,
  subWorkList: `${SERVER_URL}/deskMain/queryList`,
  getWorkSort: `${SERVER_URL}/desk/getSort`,
  deleteSubWork: `${SERVER_URL}/deskMain/deleteDeskMain`,
  addSubWork: `${SERVER_URL}/deskMain/insertOrUpdate`,
  getSubSort: `${SERVER_URL}/deskMain/getSort`,
  //更新管理
  getVersionList: `${SERVER_URL}/versionUpgrade/queryList`,
  addVersion: `${SERVER_URL}/versionUpgrade/insertOrUpdate`,
  getPatchList: `${SERVER_URL}/versionFix/queryList`,
  deletePatch: `${SERVER_URL}/versionFix/deleteVersionFix`,
  addPatch: `${SERVER_URL}/versionFix/insertOrUpdate`,
  //营销
  holidayList: `${SERVER_URL}/holiday/queryList`,
  deleteHolidayImage: `${SERVER_URL}/holidayImg/deleteHolidayImg`,
  addHolidayImage: `${SERVER_URL}/holidayImg/insertOrUpdate`,
  addHoliday: `${SERVER_URL}/holiday/insertOrUpdate`,
  deleteHoliday: `${SERVER_URL}/holiday/deleteHoliday`,
  getHolidayName: `${SERVER_URL}/holiday/holidayTime`,
  getPosterList: `${SERVER_URL}/poster/queryList`,
  addPosterImage:  `${SERVER_URL}/poster/insertOrUpdate`,
  deletePosterImage: `${SERVER_URL}/poster/deletePoster`,
  //广告
  advertList: `${SERVER_URL}/advertising/queryList`,
  addAdvert: `${SERVER_URL}/advertising/insertOrUpdate`,
  deleteAdvert: `${SERVER_URL}/advertising/delete`,
  //外出签到
  signList: `${SERVER_URL}/signLabel/queryList`,
  addSign: `${SERVER_URL}/signLabel/insertOrUpdate`,
  deleteSign: `${SERVER_URL}/signLabel/deleteSignLabel`,
  getSignNumber: `${SERVER_URL}/signLabel/getSignLabelSort`,

  subSignList: `${SERVER_URL}/signLabel/queryList`,
  deleteSubSign: `${SERVER_URL}/signLabel/deleteSignLabel`,
  addSubSign: `${SERVER_URL}/signLabel/insertOrUpdate`,
  getSubSignSort: `${SERVER_URL}/signLabel/getSignLabelSort`,
  //培训视频
  videoList: `${SERVER_URL}/video/queryList`,
  addVideo: `${SERVER_URL}/video/insertOrUpdate`,
  deleteVideo: `${SERVER_URL}/video/deleteVideo`,
  getVideoNumber: `${SERVER_URL}/video/getVideoSort`,
  getTypeSelectList: `${SERVER_URL}/baseData/queryList`,

  getAuthority: `${UC_URL}api/permission/queryByRoleIdsAndAppIds`,
  getCityList: `${UC_URL}api/city/list`,
  validateToken: `${PASSPORT_URL}checkToken`,
};

global.ssoUrl = SSO_URL;
global.secret = '';
global.ucUrl = UC_URL;
global.privateKey = '';

module.exports = global;
