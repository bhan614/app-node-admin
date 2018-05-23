const utils = require('../helper/utils');
const global = require('../global');

exports.getWorkList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.workList,
    data: {
      data
    },
    req
  });
};

exports.deleteWork = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deleteWork,
    data: {
      data
    },
    req
  });
};

exports.changeWorkState = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addWork,
    data: {
      data
    },
    req
  });
};

exports.addWork = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addWork,
    data: {
      data
    },
    req
  });
};

exports.getSubWorkList = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.subWorkList,
    data: {
      data
    },
    req
  });
};

exports.getWorkSort = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getWorkSort,
    data: {

    },
    req
  });
};

exports.deleteSubWork = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.deleteSubWork,
    data: {
      data
    },
    req
  });
};

exports.addSubWork = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.addSubWork,
    data: {
      data
    },
    req
  });
};

exports.getSubSort = (req, data) => {
  return utils.remoteGetJSON({
    url: global.apis.getSubSort,
    data: {
      data
    },
    req
  });
};
