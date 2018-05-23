
import callApi from '../../utils/callApi';

 /**
  * 获取版本列表
  */
 const getVersionList = ( { pageNum, pageSize } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/update/getVersionList';
     return callApi.post(requestUrl, {
       pageNum,
       pageSize
     }).then(res => {
       if (res.code === 0) {
         return Promise.resolve(dispatch({
           type: 'get_version_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 新增版本
  */
 const addVersion = ( {appVersion, appUrl, versionContent, appSystem, type, project } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/update/addVersion';
     return callApi.post(requestUrl, {
       appVersion,
       appUrl,
       versionContent,
       appSystem,
       type,
       project
     }).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

/**
 * 获取补丁列表
 */
const getPatchList = ( { pageNum, pageSize } ) => {
  return ( dispatch ) => {
    const requestUrl = '/api/update/getPatchList';
    return callApi.post(requestUrl, {
      pageNum,
      pageSize
    }).then(res => {
      if (res.code === 0) {
        return Promise.resolve(dispatch({
          type: 'get_patch_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 删除工作台管理主入口列表
 */
 const deletePatch = ({ id }) => {
   return ( dispatch ) => {
     const requestUrl = '/api/update/deletePatch';
     return callApi.post(requestUrl, {
       id
     }).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 添加补丁
  */
 const addPatch = ( { id, version, versionContent, url, appSystem, appVersion, gray, oper, hashcodeValue, md5Value, project } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/update/addPatch';
     const options = id !== null ? { id } : {};  //id存在更新 不存在新增
     options.version = version || '';
     options.versionContent = versionContent || '';
     options.url = url || '';
     options.appSystem = appSystem || '';
     options.appVersion = appVersion || '';
     options.gray = gray || '';
     options.oper = oper || '';
     options.hashcodeValue = hashcodeValue || '';
     options.md5Value = md5Value || '';
     options.project = project || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

export default {
  getVersionList,
  addVersion,
  getPatchList,
  deletePatch,
  addPatch
}
