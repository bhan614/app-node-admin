const express = require('express');
const service = require('../../service/auth');
const router = express.Router();

router.post('/getUserInfo', (req, res, next) => {
  service.getUserInfo(req).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getPermission', (req, res, next) => {
  const options = req.body;
  service.getPermission(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

module.exports = router;
