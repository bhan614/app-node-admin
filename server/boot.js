/**
 * 自动加载路由配置
 */
const fs = require('fs');
const path = require('path');
const logger = require('./helper/mylogger').Logger;
const URL_CONTEXT = require('../Config').context;
const {remotePostJSON} = require('./helper/utils');
const AuthService = require('./service/auth');
const global = require('./global');
const PERMISSION_ROUTER = require('../Config').menuPermissionRouter;
/**
 * 拼接用户数据
 * @param userinfo
 * @param authority
 * @returns {{}}
 */
const generateUserInfo = (userinfo, authlist) => {
  const finalData = {};
  finalData.USER_INFO = userinfo;
  finalData.AUTH_LIST = authlist;
  return finalData;
}
/**
 * 检查是否登录
 * @param req
 * @param res
 * @param next
 * @param returnUrl
 */
const checkLoginStatus = ( req, res, next, returnUrl ) => {
  const ssoUrl = process.env.SSO_URL;

  AuthService.checkLogin(req).then(doc => {
    if (doc.code === 200){
      const userInfo = doc.data;
      const appIds = ['13'];
      const { path } = req;
      const routerPath = PERMISSION_ROUTER[path];
      req.userInfo = generateUserInfo(userInfo, [])
      if (!routerPath) {
        return next();
      }
      const roleIds = (userInfo.roleDTOList || []).map((item, index) => {
        return item.id
      });
      const params = {
        roleIds,
        appIds
      };
      //roleid为空时不能请求uc
      if (roleIds.length === 0) {
        return res.redirect('/no-permission');
      }
      AuthService.getAuthDetail(params, req).then(authdoc => {
        //将用户信息写入req中
        const {data} = authdoc;
        if (data[0]) {
          const permission = data[0].permission;
          let {menuList, buttonList, apiList} = permission;
          menuList = menuList && menuList.map(item => item.permissionCode).join(',');
          buttonList = buttonList && buttonList.map(item => item.permissionCode).join(',');
          apiList = apiList && apiList.map(item => item.permissionCode).join(',');
          if (menuList && menuList.includes(routerPath)) {
            const permission = {menuList, buttonList, apiList}
            req.userInfo = generateUserInfo(userInfo, permission)
            return next();
          }
          return res.redirect('/no-permission');
        }
        return res.redirect('/no-permission');
      }).catch(err => {
        console.log(err);
      })
    } else {
      if ( returnUrl ) {
       res.redirect( `${ssoUrl}/login?returnUrl=${returnUrl}` );
     } else {
       const code = doc.code === 512 ? 512 : 601
       const msg = doc.msg || '登录错误'
       res.json({code, msg});
     }
    }
  }).catch(err => {
    res.redirect( `${ssoUrl}login?returnUrl=${returnUrl}` );
  });
}

const checkPage = ( req, res, next ) => {
  const returnUrl = `${encodeURIComponent(`${req.protocol}://${req.headers.host}${req.originalUrl}`)}` || '';
  checkLoginStatus( req, res, next, returnUrl )
}

const checkApi = ( req, res, next ) => {
  checkLoginStatus( req, res, next )
}

const Page = require('./routes/page/index'); //页面路由


function addRoute(app, options) {
  const apiDir = '/routes/api/';
  const apiRootPath = path.join(__dirname,apiDir);
  /**
   * 构建路由拦截相对路径
   * @param routePath
   * @returns {string}
   */
  const buildRouteContext = function (routePath) {
    const rootLength = apiRootPath.length;
    return routePath.length === rootLength
      ? apiDir
      : `${apiDir}${routePath.substring(rootLength)}/`;
  };

  const isFile = function (name) {
    return (/\.js/).test(name);
  };
  /**
   * 递归添加api路由
   * @param routePath
   */
  const addApiRoute = function (routePath) {
    fs.readdirSync(routePath).forEach((name) => {
      if (!isFile(name)) {
        addApiRoute(path.join(routePath, name)); //递归添加子路由
      } else {
        const route = buildRouteContext(routePath);
        const routeName = (route + name.replace(/.js/, '')).replace(/\\/g, '/');

        const obj = require(`.${routeName}`);
        app.use(URL_CONTEXT + routeName.replace(/\/routes/,''), checkApi, obj);
        logger.info(`add api route automatic:${routeName.replace(/\/routes/,'')}`);
      }
    });
  };

  //api路由配置
  addApiRoute(apiRootPath);
}

module.exports = function(app){
  addRoute(app); //添加api路由
  app.use(`${URL_CONTEXT}`, checkPage, Page); //页面级别路由
};
