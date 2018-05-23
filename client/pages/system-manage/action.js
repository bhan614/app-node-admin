
import callApi from '../../utils/callApi';

 /**
  * 获取工作台主入口列表
  */
 const getWorkList = ( { pageNum, pageSize } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/system/getWorkList';
     return callApi.post(requestUrl, {
       pageNum,
       pageSize
     }).then(res => {
       if (res.code === 0) {
         return Promise.resolve(dispatch({
           type: 'get_work_list',
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
  const deleteWork = ({ id }) => {
    return ( dispatch ) => {
      const requestUrl = '/api/system/deleteWork';
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
   * 修改工作台主入口状态
   */
 const changeWorkState = ({ id, status, sort }) => {
   return ( dispatch ) => {
     const requestUrl = '/api/system/addWork';
     const options = sort !== null ? { sort } : {};
     options.id = id || '';
     options.status = status || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 添加工作台主入口
  */
 const addWork = ( { id, name, authCode, sort, deskUrl, status } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/system/addWork';
     const options = id !== null ? { id } : {};  //id存在更新 不存在新增
     options.name = name || '';
     options.authCode = authCode || '';
     options.sort = sort || '';
     options.deskUrl = deskUrl || '';
     options.status = status || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 获取主工作台序号
  */
 const getWorkSort = () => {
   return ( dispatch ) => {
     const requestUrl = '/api/system/getWorkSort';
     return callApi.post(requestUrl).then(res => {
       if (res.code === 0) {
         return Promise.resolve(dispatch({
           type: 'get_work_sort',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 获取工作台子入口列表
  */
 const getSubWorkList = ( { pageNum, pageSize, id } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/system/getSubWorkList';
     return callApi.post(requestUrl, {
       pageNum,
       pageSize,
       parentId: id
     }).then(res => {
       if (res.code === 0) {
         return Promise.resolve(dispatch({
           type: 'get_subWork_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }
 /**
  * 删除工作台管理子入口列表
  */
  const deleteSubWork = ({ id }) => {
    return ( dispatch ) => {
      const requestUrl = '/api/system/deleteSubWork';
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
 * 添加工作台子入口
 */
const addSubWork = ( { id, parentId, name, icon, authCode, sort, httpUrl, status } ) => {
  return ( dispatch ) => {
    const requestUrl = '/api/system/addSubWork';
    const options = id !== null ? { id } : {};  //id存在更新 不存在新增
    options.name = name || '';
    options.icon = icon || '';
    options.authCode = authCode || '';
    options.sort = sort || '';
    options.httpUrl = httpUrl || '';
    options.status = status || '';
    options.parentId = parentId;
    return callApi.post(requestUrl, options).then(res => {
      if (res.code === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 获取主工作台序号
 */
const getSubSort = ({ parentId }) => {
  return ( dispatch ) => {
    const requestUrl = '/api/system/getSubSort';
    return callApi.post(requestUrl, {
      parentId
    }).then(res => {
      if (res.code === 0) {
        return Promise.resolve(dispatch({
          type: 'get_subWork_sort',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 修改工作台主入口状态
 */
const changeSubWorkState = ({ id, status, parentId, sort }) => {
 return ( dispatch ) => {
   const requestUrl = '/api/system/addSubWork';
   const options = sort !== null ? { sort } : {};
   options.id = id;
   options.status = status;
   options.parentId = parentId;
   return callApi.post(requestUrl, options).then(res => {
     if (res.code === 0) {
       return Promise.resolve(res)
     }
     return Promise.reject(res)
   });
 }
}

export default {
  getWorkList,
  deleteWork,
  changeWorkState,
  addWork,
  getSubWorkList,
  getWorkSort,
  deleteSubWork,
  addSubWork,
  getSubSort,
  changeSubWorkState
}
