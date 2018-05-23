const utils = require('../helper/utils');
const global = require('../global');

exports.getVersionList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getVersionList,
    data: {
      data
    },
    req
  });
};

exports.addVersion = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addVersion,
    data: {
      data
    },
    req
  });
};

exports.getPatchList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getPatchList,
    data: {
      data
    },
    req
  });
};

exports.deletePatch = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deletePatch,
    data: {
      data
    },
    req
  });
};

exports.addPatch = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addPatch,
    data: {
      data
    },
    req
  });
};
