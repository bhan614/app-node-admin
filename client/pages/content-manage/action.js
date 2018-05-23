
import callApi from '../../utils/callApi';
import {uploadData} from '../../utils/uploadData';

/**
 * 获取战报头条列表
 */
const getNewsList = ( { pageNum, pageSize } ) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/getNewsList';
    return callApi.post(requestUrl, {
      pageNum,
      pageSize
    }).then(res => {
      if (res.code === 0) {
        return Promise.resolve(dispatch({
          type: 'get_news_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 删除战报头条
 */
 const deleteNews = ({ id }) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/deleteNews';
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
  * 添加和修改战报头条
  */
 const addNews = ( { id, orgName, manager, adviser, product, achieve, amount, cityCode, cityName, type } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/addNews';
     const options = id !== null ? { id } : {};  //id存在更新 不存在新增
     options.orgName = orgName || '';
     options.manager = manager || '';
     options.adviser = adviser || '';
     options.product = product || '';
     options.achieve = achieve || '';
     options.amount = amount || '';
     options.cityCode = cityCode || '';
     options.cityName = cityName || '';
     options.type = type || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }
 /**
  * 获取轮播图管理列表
  */
 const getCarouselList = ( { pageNum, pageSize } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/getCarouselList';
     return callApi.post(requestUrl, {
       pageNum,
       pageSize
     }).then(res => {
       if (res.code === 0) {
         return Promise.resolve(dispatch({
           type: 'get_carousel_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 添加和修改轮播图
  */
 const addCarousel = ( { id, title, url, imgUrl, sort, status } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/addCarousel';
     const options = id !== null ? { id } : {};  //id存在更新 不存在新增
     options.title = title || '';
     options.url = url || '';
     options.imgUrl = imgUrl || '';
     options.sort = sort || '';
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
  * 删除轮播管理列表
  */
  const deleteCarousel = ({ id }) => {
    return ( dispatch ) => {
      const requestUrl = '/api/content/deleteCarousel';
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
 * 修改轮播图状态
 */
 const changeCarouselState = ({ id, status, sort }) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/addCarousel';
     const options = sort !== null ? { sort } : {};
     options.id = id;
     options.status = status;
     return callApi.post(requestUrl, options).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }
 /**
  * 获取公告管理列表
  */
 const getNoticeList = ( { pageNum, pageSize, cityCode, title, status, type, serType } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/getNoticeList';
     const options = {
       pageNum,
       pageSize
     }
     if (cityCode) {
       options.cityCode = cityCode
     }
     if (title) {
       options.title = title
     }
     if (status) {
       options.status = status
     }
     if (type) {
       options.type = type
     }
     if (serType) {
       options.serType = serType
     }
     return callApi.post(requestUrl, options).then(res => {
       if (res.code === 0) {
         return Promise.resolve(dispatch({
           type: 'get_notice_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }
 /**
  * 删除公告管理列表
  */
  const deleteNotice = ({ id }) => {
    return ( dispatch ) => {
      const requestUrl = '/api/content/deleteNotice';
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
   * 修改公告状态
   */
 const changeNoticeState = ({ id, status, cityCode, type, isTop }) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/changeNoticeState';
     return callApi.post(requestUrl, {
       id,
       status,
       cityCode,
       type,
       isTop
     }).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 公告置顶
  */
const changeNoticeTop = ({ id, isTop, cityCode, type, status }) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/changeNoticeState';
    return callApi.post(requestUrl, {
      id,
      isTop,
      cityCode,
      type,
      status
    }).then(res => {
      if (res.code === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}
 /**
  * 添加公告
  */
 const addNotice = ( { id, type, serType, cityName, cityCode, label, title, description, content, feedbackEmail, status, isTop } ) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/addNotice';
     const options = id !== null ? { id } : {};  //id存在更新 不存在新增
     options.type = type || '';
     options.title = title || '';
     options.content = content || '';
     options.status = status || '';
     options.description = description || '';
     options.isTop = isTop || '0';
     if (serType) {
       options.serType = serType
     }
     if (cityName) {
       options.cityName = cityName
       options.cityCode = cityCode
     }
     if (label) {
       options.label = label
     }
     if (feedbackEmail) {
       options.feedbackEmail = feedbackEmail
     }
     return callApi.post(requestUrl, options).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }
 /**
  * 新闻banner序号
  */
 const getBannerNumber = () => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/getBannerNumber';
     return callApi.post(requestUrl, {
     }).then(res => {
       if (res.code === 0) {
         return Promise.resolve(dispatch({
           type: 'get_banner_sort',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }
 /**
  * 上传本地图片
  */
 const urlToBase64 = ({ fileUrl }) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/urlToBase64';
     return callApi.post(requestUrl, {fileUrl}).then(res => {
       if (res.base64) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 const uploadFiles = (formData) => {
  return ( dispatch ) => {
    const requestUrl = uploadData.url;
    return callApi.postForm(requestUrl, formData).then(res => {
      if (res.code === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
 * uc城市下拉列表
 */
const getCityList = () => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/getCityList';
    return callApi.post(requestUrl, {
    }).then(res => {
      if (res.code === 200) {
        return Promise.resolve(dispatch({
          type: 'get_city_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 获取广告管理列表
 */
const getAdvertList = ( { pageNum, pageSize } ) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/getAdvertList';
    return callApi.post(requestUrl, {
      pageNum,
      pageSize
    }).then(res => {
      if (res.code === 0) {
        return Promise.resolve(dispatch({
          type: 'get_advert_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 添加和修改广告
 */
const addAdvert = (formData) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/addAdvert';
    return callApi.post(requestUrl, formData).then(res => {
      if (res.code === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 删除广告管理列表
 */
 const deleteAdvert = ({ id }) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/deleteAdvert';
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
* 修改广告状态
*/
const changeAdvertState = (formData) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/addAdvert';
    return callApi.post(requestUrl, formData).then(res => {
      if (res.code === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 获取签到标签列表
 */
const getSignList = (formData) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/getSignList';
    return callApi.post(requestUrl, formData).then(res => {
      if (res.code === 0) {
        return Promise.resolve(dispatch({
          type: 'get_sign_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 添加和修改签到标签
 */
const addSign = (formData) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/addSign';
    return callApi.post(requestUrl, formData).then(res => {
      if (res.code === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 删除广告管理列表
 */
 const deleteSign = ({ id }) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/deleteSign';
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
* 修改广告状态
*/
const changeSignState = (formData) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/addSign';
    return callApi.post(requestUrl, formData).then(res => {
      if (res.code === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}
/**
 * 获取签到标签排序
 */
const getSignNumber = () => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/getSignNumber';
    return callApi.post(requestUrl, {
    }).then(res => {
      if (res.code === 0) {
        return Promise.resolve(dispatch({
          type: 'get_sign_sort',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 获取视频列表
 */
const getVideoList = (formData) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/getVideoList';
    return callApi.post(requestUrl, formData).then(res => {
      if (res.code === 0) {
        return Promise.resolve(dispatch({
          type: 'get_video_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 添加和修改视频
 */
const addVideo = (formData) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/addVideo';
    return callApi.post(requestUrl, formData).then(res => {
      if (res.code === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 删除视频
 */
 const deleteVideo = ({ id }) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/deleteVideo';
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
* 修改视频
*/
const changeVideoState = (formData) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/addVideo';
    return callApi.post(requestUrl, formData).then(res => {
      if (res.code === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}
/**
 * 获取视频排序
 */
const getVideoNumber = () => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/getVideoNumber';
    return callApi.post(requestUrl, {
    }).then(res => {
      if (res.code === 0) {
        return Promise.resolve(dispatch({
          type: 'get_video_sort',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 获取视频分类下拉
 */
const getTypeSelectList = () => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/getTypeSelectList';
    return callApi.post(requestUrl, {
    }).then(res => {
      if (res.code === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 获取标签子入口列表
 */
const getSubSignList = (formData) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/getSubSignList';
    return callApi.post(requestUrl, formData).then(res => {
      if (res.code === 0) {
        return Promise.resolve(dispatch({
          type: 'get_subSign_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 获取子标签排序
 */
const getSubSignSort = (formData) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/getSubSignSort';
    return callApi.post(requestUrl, formData).then(res => {
      if (res.code === 0) {
        return Promise.resolve(dispatch({
          type: 'get_subSign_sort',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 删除标签子入口列表
 */
 const deleteSubSign = (formData) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/deleteSubSign';
     return callApi.post(requestUrl, formData).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 修改标签入口状态
  */
 const changeSubSignState = (formData) => {
  return ( dispatch ) => {
    const requestUrl = '/api/content/addSubSign';
    return callApi.post(requestUrl, formData).then(res => {
      if (res.code === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
 }

 /**
  * 添加标签子入口
  */
 const addSubSign = (formData) => {
   return ( dispatch ) => {
     const requestUrl = '/api/content/addSubSign';
     return callApi.post(requestUrl, formData).then(res => {
       if (res.code === 0) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

export default {
  getNewsList,
  deleteNews,
  addNews,
  getCarouselList,
  addCarousel,
  deleteCarousel,
  changeCarouselState,
  getNoticeList,
  deleteNotice,
  changeNoticeState,
  addNotice,
  getBannerNumber,
  urlToBase64,
  uploadFiles,
  getCityList,
  changeNoticeTop,
  getAdvertList,
  addAdvert,
  deleteAdvert,
  changeAdvertState,
  getSignList,
  addSign,
  deleteSign,
  changeSignState,
  getSignNumber,
  getVideoList,
  addVideo,
  deleteVideo,
  changeVideoState,
  getVideoNumber,
  getTypeSelectList,
  getSubSignList,
  getSubSignSort,
  deleteSubSign,
  changeSubSignState,
  addSubSign
}
