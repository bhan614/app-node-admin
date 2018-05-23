const utils = require('../helper/utils');
const global = require('../global');

exports.getNewsList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.newsList,
    data: {
      data
    },
    req
  });
};

exports.deleteNews = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deleteNews,
    data: {
      data
    },
    req
  });
};

exports.addNews = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addNews,
    data: {
      data
    },
    req
  });
};

exports.getCarouselList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.carouselList,
    data: {
      data
    },
    req
  });
};

exports.carouselUpload = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.carouselUpload,
    data,
    req
  });
};

exports.addCarousel = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addCarousel,
    data: {
      data
    },
    req
  });
};

exports.deleteCarousel = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deleteCarousel,
    data: {
      data
    },
    req
  });
};

exports.changeCarouselState = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addCarousel,
    data: {
      data
    },
    req
  });
};

exports.getNoticeList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.noticeList,
    data: {
      data
    },
    req
  });
};

exports.deleteNotice = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deleteNotice,
    data: {
      data
    },
    req
  });
};

exports.changeNoticeState = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addNotice,
    data: {
      data
    },
    req
  });
};

exports.addNotice = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addNotice,
    data: {
      data
    },
    req
  });
};

exports.getBannerNumber = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getBannerNumber,
    data: {
    },
    req
  });
};

exports.getCityList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getCityList,
    data,
    req
  });
};

exports.getAdvertList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.advertList,
    data: {
      data
    },
    req
  });
};

exports.addAdvert = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addAdvert,
    data: {
      data
    },
    req
  });
};

exports.deleteAdvert = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deleteAdvert,
    data: {
      data
    },
    req
  });
};

exports.getSignList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.signList,
    data: {
      data
    },
    req
  });
};

exports.addSign = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addSign,
    data: {
      data
    },
    req
  });
};

exports.deleteSign = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deleteSign,
    data: {
      data
    },
    req
  });
};

exports.getSignNumber = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getSignNumber,
    data: {
    },
    req
  });
};

exports.getVideoList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.videoList,
    data: {
      data
    },
    req
  });
};

exports.addVideo = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addVideo,
    data: {
      data
    },
    req
  });
};

exports.deleteVideo = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deleteVideo,
    data: {
      data
    },
    req
  });
};

exports.getVideoNumber = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getVideoNumber,
    data: {
    },
    req
  });
};

exports.getTypeSelectList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getTypeSelectList,
    data: {
    },
    req
  });
};

exports.getSubSignList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.subSignList,
    data: {
      data
    },
    req
  });
};

exports.deleteSubSign = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deleteSubSign,
    data: {
      data
    },
    req
  });
};

exports.addSubSign = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addSubSign,
    data: {
      data
    },
    req
  });
};

exports.getSubSignSort = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getSubSignSort,
    data: {
      data
    },
    req
  });
};
