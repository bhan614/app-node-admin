const express = require('express');
const service = require('../../service/update');
const router = express.Router();

router.post('/getVersionList', (req, res, next) => {
  const {pageNum, pageSize} = req.body;
  service.getVersionList(req, {
    pageNum,
    pageSize
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addVersion', (req, res, next) => {
  const options = req.body;
  service.addVersion(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getPatchList', (req, res, next) => {
  const {pageNum, pageSize} = req.body;
  service.getPatchList(req, {
    pageNum,
    pageSize
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deletePatch', (req, res, next) => {
  const {id} = req.body;
  service.deletePatch(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addPatch', (req, res, next) => {
  const options = req.body;
  service.addPatch(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

module.exports = router;
