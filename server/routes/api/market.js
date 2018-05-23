const express = require('express');
const service = require('../../service/market');
const router = express.Router();

router.post('/getHolidayList', (req, res, next) => {
  const {pageNum, pageSize} = req.body;
  service.getHolidayList(req, {
    pageNum,
    pageSize
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deleteHolidayImage', (req, res, next) => {
  const {id} = req.body;
  service.deleteHolidayImage(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addHolidayImage', (req, res, next) => {
  const options = req.body;
  service.addHolidayImage(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addHoliday', (req, res, next) => {
  const options = req.body;
  service.addHoliday(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deleteHoliday', (req, res, next) => {
  const options = req.body;
  service.deleteHoliday(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getHolidayName', (req, res, next) => {
  service.getHolidayName(req, {}).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getPosterList', (req, res, next) => {
  const options = req.body;
  service.getPosterList(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addPosterImage', (req, res, next) => {
  const options = req.body;
  service.addPosterImage(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deletePosterImage', (req, res, next) => {
  const options = req.body;
  service.deletePosterImage(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

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
