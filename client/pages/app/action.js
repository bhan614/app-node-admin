import callApi from '../../utils/callApi';
/**
 * 修改loading状态
 * @param status
 * @returns {function()}
 */
const loading = (status) => {
  return (dispatch) => {
    return Promise.resolve(dispatch({
      type: 'app_loading',
      status
    }));
  }
}

const getUserInfo = () => {
  return ( dispatch ) => {
    const requestUrl = '/api/auth/getUserInfo';
    return callApi.post(requestUrl).then(res => {
      if (res.code === 1) {
        return Promise.resolve(dispatch({
          type: 'get_user_info',
          data: res.data
        }));
      }
      return Promise.reject(res)
    });
  }
}

const getPermission = ({ roleIds, appIds }) => {
  return ( dispatch ) => {
    const requestUrl = '/api/auth/getPermission';
    return callApi.post(requestUrl, {
      roleIds,
      appIds
    }).then(res => {
      if (res.code === 200) {
        return Promise.resolve(dispatch({
          type: 'get_user_permission',
          data: res.data[0]
        }));
      }
      return Promise.reject(res)
    });
  }
}

export default {
  loading,
  getUserInfo,
  getPermission
}
