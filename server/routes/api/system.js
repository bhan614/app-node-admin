const express = require('express');
const service = require('../../service/system');
const router = express.Router();

router.post('/getWorkList', (req, res, next) => {
  const {pageNum, pageSize} = req.body;
  service.getWorkList(req, {
    pageNum,
    pageSize
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deleteWork', (req, res, next) => {
  const {id} = req.body;
  service.deleteWork(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/changeWorkState', (req, res, next) => {
  const {id} = req.body;
  service.changeWorkState(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addWork', (req, res, next) => {
  const options = req.body;
  service.addWork(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getSubWorkList', (req, res, next) => {
  const options = req.body;
  service.getSubWorkList(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getWorkSort', (req, res, next) => {
  service.getWorkSort(req, {

  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deleteSubWork', (req, res, next) => {
  const {id} = req.body;
  service.deleteSubWork(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addSubWork', (req, res, next) => {
  const options = req.body;
  service.addSubWork(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getSubSort', (req, res, next) => {
  const options = req.body;
  service.getSubSort(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

module.exports = router;
