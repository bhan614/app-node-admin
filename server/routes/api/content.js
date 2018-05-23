const express = require('express');
const service = require('../../service/content');
const router = express.Router();
const fs = require('fs');

router.post('/getNewsList', (req, res, next) => {
  const {pageNum, pageSize} = req.body;
  service.getNewsList(req, {
    pageNum,
    pageSize
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deleteNews', (req, res, next) => {
  const {id} = req.body;
  service.deleteNews(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addNews', (req, res, next) => {
  const options = req.body;
  service.addNews(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getCarouselList', (req, res, next) => {
  const {pageNum, pageSize} = req.body;
  service.getCarouselList(req, {
    pageNum,
    pageSize
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/carouselUpload', (req, res, next) => {
  const options = req.body;
  service.carouselUpload(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addCarousel', (req, res, next) => {
  const options = req.body;
  service.addCarousel(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deleteCarousel', (req, res, next) => {
  const {id} = req.body;
  service.deleteCarousel(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/changeCarouselState', (req, res, next) => {
  const {id, status} = req.body;
  service.changeCarouselState(req, {
    id,
    status
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getNoticeList', (req, res, next) => {
  const options = req.body;
  service.getNoticeList(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deleteNotice', (req, res, next) => {
  const {id} = req.body;
  service.deleteNotice(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/changeNoticeState', (req, res, next) => {
  const options = req.body;
  service.changeNoticeState(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addNotice', (req, res, next) => {
  const options = req.body;
  service.addNotice(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getBannerNumber', (req, res, next) => {
  service.getBannerNumber(req).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getCityList', (req, res, next) => {
  service.getCityList(req).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/urlToBase64', (req, res, next) => {
  const file = req.body.fileUrl;
  const bitmap = fs.readFileSync(file.replace('file://localhost', '').replace('%20', ' '));
  const type = file.substring(file.length-3, file.length);
  const base64 = new Buffer(bitmap).toString('base64');
  const result = 'data:image/' + type + ';base64,' + base64;
  res.send({base64: result});
});

router.post('/getAdvertList', (req, res, next) => {
  const options = req.body;
  service.getAdvertList(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addAdvert', (req, res, next) => {
  const options = req.body;
  service.addAdvert(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deleteAdvert', (req, res, next) => {
  const {id} = req.body;
  service.deleteAdvert(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/changeAdvertState', (req, res, next) => {
  const options = req.body;
  service.addAdvert(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getSignList', (req, res, next) => {
  const options = req.body;
  service.getSignList(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addSign', (req, res, next) => {
  const options = req.body;
  service.addSign(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deleteSign', (req, res, next) => {
  const {id} = req.body;
  service.deleteSign(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getSignNumber', (req, res, next) => {
  service.getSignNumber(req).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getVideoList', (req, res, next) => {
  const options = req.body;
  service.getVideoList(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addVideo', (req, res, next) => {
  const options = req.body;
  service.addVideo(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deleteVideo', (req, res, next) => {
  const {id} = req.body;
  service.deleteVideo(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getVideoNumber', (req, res, next) => {
  service.getVideoNumber(req).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getTypeSelectList', (req, res, next) => {
  service.getTypeSelectList(req).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getSubSignList', (req, res, next) => {
  const options = req.body;
  service.getSubSignList(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/deleteSubSign', (req, res, next) => {
  const {id} = req.body;
  service.deleteSubSign(req, {
    id
  }).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/addSubSign', (req, res, next) => {
  const options = req.body;
  service.addSubSign(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

router.post('/getSubSignSort', (req, res, next) => {
  const options = req.body;
  service.getSubSignSort(req, options).then((body) => {
    res.json(body);
  }).catch((err) => {
    next(err);
  });
});

module.exports = router;
