//services
const isDev = process.env.NODE_ENV === 'development';
//加载webpack打包后的静态文件映射表
const fileMapping = process.env.NODE_ENV === 'development' ? null : require('../../public/dist/mapping.json');

const {URL_CONTEXT} = require('../global');
//静态文件上下文路径
const staticResourceContext = `${URL_CONTEXT}/dist/`;

/**
 * 构建样式列表
 * @param key
 */
exports.getCss = function (key) {
  const buildLink = function (href) {
    return `<link href="${href}" rel="stylesheet">`;
  };
  if (!isDev) {
    return `${buildLink(fileMapping[`${staticResourceContext}${key}.css`])}`;
  }else{
    return '';
  }
};

/**
 * 获取js列表
 * @param key
 */
exports.getJs = function (key) {

  console.log(key,'-------------')
  const buildScript = function (src) {
    return `<script src="${src}"></script>`;
  };
  if (isDev) {
    return `${buildScript(`${URL_CONTEXT}/dll/vendor.dll.js`)}
          ${buildScript(`${URL_CONTEXT}/ckeditor/ckeditor.js`)}
         ${buildScript(`${staticResourceContext}${key}.bundle.js`)}`;
  } else {
    return `${buildScript(fileMapping[`${staticResourceContext}manifest.js`])}
        ${buildScript(`${URL_CONTEXT}/ckeditor/ckeditor.js`)}
        ${buildScript(fileMapping[`${staticResourceContext}vendor.js`])}
        ${buildScript(fileMapping[`${staticResourceContext}${key}.js`])}`;
  }
};
