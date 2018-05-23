/*eslint camelcase: ["error", {properties: "never"}]*/
const menuConfig = {
  bkgj_stage_menu_Base: {
    key: 'Base',
    icon: 'database',
    name: '基础配置',
    sub: {
      bkgj_stage_menu_Banner: {
        key: 'Banner',
        name: '轮播图管理',
      },
      bkgj_stage_menu_SalesPerformance: {
        key: 'SalesPerformance',
        name: '战报头条管理',
      },
      bkgj_stage_menu_Desk: {
        key: 'Desk',
        name: '工作台管理',
      },
      bkgj_stage_menu_Advert: {
        key: 'Advert',
        name: '开屏管理',
      },
      bkgj_stage_menu_Sign: {
        key: 'Sign',
        name: '外出签到标签管理',
      }
    }
  },
  bkgj_stage_menu_Content: {
    key: 'Content',
    icon: 'file-text',
    name: '内容管理',
    sub: {
      bkgj_stage_menu_News: {
        key: 'News',
        name: '公告管理',
      },
      bkgj_stage_menu_Video: {
        key: 'Video',
        name: '培训视频管理',
      }
    }
  },
  bkgj_stage_menu_Market: {
    key: 'Market',
    icon: 'gift',
    name: '营销管理',
    sub: {
      bkgj_stage_menu_FestivalManage: {
        key: 'FestivalManage',
        name: '节日管理',
      },
      bkgj_stage_menu_ProductPosterManage: {
        key: 'ProductPosterManage',
        name: '海报管理',
      }
    }
  },
  bkgj_stage_menu_System: {
    key: 'System',
    icon: 'setting',
    name: '系统管理',
    sub: {
      bkgj_stage_menu_Version: {
        key: 'Version',
        name: '版本管理',
      },
      bkgj_stage_menu_Patch: {
        key: 'Patch',
        name: '补丁管理',
      }
    }
  }
};

const permissionListConfig = {
  menuList: ['bkgj_stage_menu_Base', 'bkgj_stage_menu_Banner', 'bkgj_stage_menu_SalesPerformance', 'bkgj_stage_menu_Desk', 'bkgj_stage_menu_Content',
  'bkgj_stage_menu_News', 'bkgj_stage_menu_Market', 'bkgj_stage_menu_FestivalManage', 'bkgj_stage_menu_ProductPosterManage', 'bkgj_stage_menu_System',
  'bkgj_stage_menu_Version', 'bkgj_stage_menu_Patch', 'bkgj_stage_menu_Advert', 'bkgj_stage_menu_Sign', 'bkgj_stage_menu_Video'],
  buttonList: ['bkgj_stage_btn_Top'],
};

export {
  menuConfig,
  permissionListConfig
}
