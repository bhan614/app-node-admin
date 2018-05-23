const utils = require('../helper/utils');
const global = require('../global');

exports.getHolidayList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.holidayList,
    data: {
      data
    },
    req
  });
};

exports.deleteHolidayImage = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deleteHolidayImage,
    data: {
      data
    },
    req
  });
};

exports.addHolidayImage = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addHolidayImage,
    data: {
      data
    },
    req
  });
};

exports.addHoliday = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addHoliday,
    data: {
      data
    },
    req
  });
};

exports.deleteHoliday = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deleteHoliday,
    data: {
      data
    },
    req
  });
};

exports.getHolidayName = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getHolidayName,
    data: {

    },
    req
  });
};

exports.getPosterList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getPosterList,
    data: {
      data
    },
    req
  });
};

exports.addPosterImage = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addPosterImage,
    data: {
      data
    },
    req
  });
};

exports.deletePosterImage = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deletePosterImage,
    data: {
      data
    },
    req
  });
};

exports.getPermission = (req, data) => {
  return utils.remoteGetJSON({
    url: `${global.ucUrl}api/permission/queryByRoleIdsAndAppIds`,
    data,
    req
  });
};
