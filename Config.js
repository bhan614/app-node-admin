/**
 * 配置二级目录和入口文件
 * @type {{context: string, entry: {panel: string[]}}}
 *
 * TODO:context和entry修改
 */
module.exports = {
  context: '', //二级目录
  entry: {
    panel: ['./client/pages/panel.js']
  },
  menuPermissionRouter: {
  '/': 'bkgj_stage_menu_Base',
  '/Base/Banner': 'bkgj_stage_menu_Banner',
  '/Base/SalesPerformance': 'bkgj_stage_menu_SalesPerformance',
  '/Base/Advert': 'bkgj_stage_menu_Advert',
  '/Base/Desk': 'bkgj_stage_menu_Desk',
  '/Base/subWork': 'bkgj_stage_menu_Desk',
  '/Base/Sign': 'bkgj_stage_menu_Sign',
  '/Content/News': 'bkgj_stage_menu_News',
  '/Content/Video': 'bkgj_stage_menu_Video',
  '/System/Version': 'bkgj_stage_menu_Version',
  '/System/Patch': 'bkgj_stage_menu_Patch',
  '/Market/FestivalManage': 'bkgj_stage_menu_FestivalManage',
  '/Market/ProductPosterManage': 'bkgj_stage_menu_ProductPosterManage'
  }
};
