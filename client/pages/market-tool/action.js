
import callApi from '../../utils/callApi';

/**
 * 获取节日管理列表
 */
const getHolidayList = ( { pageNum, pageSize } ) => {
  return ( dispatch ) => {
    const requestUrl = '/api/market/getHolidayList';
    return callApi.post(requestUrl, {
      pageNum,
      pageSize
    }).then(res => {
      if (res.code === 0) {
        return Promise.resolve(dispatch({
          type: 'get_holiday_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 删除节日图片
 */
 const deleteHolidayImage = ({ id }) => {
   return ( dispatch ) => {
     const requestUrl = '/api/market/deleteHolidayImage';
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
  * 添加节日图片
  */
 const addHolidayImage = ( { id, parentId, imgUrl, status } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/market/addHolidayImage';
     const options = {};
     options.id = id || '';
     options.parentId = parentId || '';
     options.imgUrl = imgUrl || '';
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
  * 添加节日
  */
 const addHoliday = ( { id, name, time } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/market/addHoliday';
     const options = id !== null ? { id } : {};  //id存在更新 不存在新增
     options.name = name || '';
     options.time = time || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

/**
 * 删除节日
 */
 const deleteHoliday = ({ id }) => {
   return ( dispatch ) => {
     const requestUrl = '/api/market/deleteHoliday';
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
  * 获取所有节日名
  */
  const getHolidayName = () => {
    return ( dispatch ) => {
      const requestUrl = '/api/market/getHolidayName';
      return callApi.post(requestUrl, {

      }).then(res => {
        if (res.code === 0) {
          return Promise.resolve(dispatch({
            type: 'get_holiday_name',
            data: res.data
          }))
        }
        return Promise.reject(res)
      });
    }
  }
 /**
  * 获取海报管理列表
  */
 const getPosterList = ( { pageNum, pageSize, type, description, cityCode } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/market/getPosterList';
     return callApi.post(requestUrl, {
       pageNum,
       pageSize,
       type,
       description: description || '',
       cityCode
     }).then(res => {
       if (res.code === 0) {
         return Promise.resolve(dispatch({
           type: 'get_poster_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 添加海报图片
  */
 const addPosterImage = ( { id, type, imgUrl, description, status, cityName, cityCode, title } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/market/addPosterImage';
     const options = id !== null ? { id } : {};  //id存在更新 不存在新增
     options.type = type || '';
     options.imgUrl = imgUrl || '';
     options.description = description || '';
     options.title = title || '';
     options.status = status || '';
     options.cityName = cityName || '';
     options.cityCode = cityCode || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 删除海报图
  */
  const deletePosterImage = ({ id }) => {
    return ( dispatch ) => {
      const requestUrl = '/api/market/deletePosterImage';
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

export default {
  getHolidayList,
  deleteHolidayImage,
  addHolidayImage,
  addHoliday,
  deleteHoliday,
  getPosterList,
  addPosterImage,
  deletePosterImage,
  getHolidayName
}
