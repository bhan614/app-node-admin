/**
 * 前台首页路由设置
 */

'use strict'
const express = require('express');
const router = express.Router();

const template = require('../../helper/template');

/**
 * 后台入口
 */
router.get('/',function (req,res,next) {
  const {userInfo} = req;
  const data = userInfo;
  res.render('panel', {
    title : '雅典娜管理后台',
    scripts : template.getJs('panel'),
    links : template.getCss('css'),
    data : JSON.stringify(data)
  });
});

/**
 * 后台入口
 */
router.get('*',function (req,res,next) {
  const {userInfo} = req;
  const data = userInfo;
  res.render('panel', {
    title : '雅典娜管理后台',
    scripts : template.getJs('panel'),
    links : template.getCss('css'),
    data : JSON.stringify(data)
  });
});

module.exports = router;
