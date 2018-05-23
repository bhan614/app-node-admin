import React from 'react'
import { render } from 'react-dom'
import {Route, IndexRoute, IndexRedirect} from 'react-router';
import {combineReducers} from 'redux-immutable';

const URL_CONTEXT = require('../../Config').context;
/**
 * 这里用来配置路由规则
 */
import App from './app/index';
import News from './content-manage/news'
import Carousel from './content-manage/carousel'
import Notice from './content-manage/notice'
import Work from './system-manage/work'
import SubWork from './system-manage/subWork'
import Version from './update-manage/version'
import Patch from './update-manage/patch'
import Holiday from './market-tool/holiday'
import Poster from './market-tool/poster'
import Advert from './content-manage/advert'
import Sign from './content-manage/sign'
import SubSign from './content-manage/subSign'
import Video from './content-manage/video'
import ErrorPage from './app/errorPage';

const routes = (
  <Route path="/" breadcrumbName="主页" icon="home" component={App}>
    <IndexRedirect to='Base' />
    <Route breadcrumbName="基础配置" path="Base">
      <IndexRedirect to='Banner' />
      <Route path="Banner" breadcrumbName="轮播图管理" component={Carousel} />
      <Route path="SalesPerformance" breadcrumbName="战报头条管理" component={News} />
      <Route path="Desk" breadcrumbName="工作台管理" component={Work} />
      <Route path="subWork" breadcrumbName="子入口" component={SubWork} />
      <Route path="Advert" breadcrumbName="开屏管理" component={Advert} />
      <Route path="Sign" breadcrumbName="外出签到标签" component={Sign} />
      <Route path="subSign" breadcrumbName="外出签到标签" component={SubSign} />
    </Route>
    <Route breadcrumbName="内容管理" path="Content">
      <IndexRedirect to='News' />
      <Route path="News" breadcrumbName="公告管理" component={Notice} />
      <Route path="Video" breadcrumbName="培训视频管理" component={Video} />
    </Route>
    <Route breadcrumbName="营销管理" path="Market">
      <IndexRedirect to='FestivalManage' />
      <Route path="FestivalManage" breadcrumbName="节日管理" component={Holiday} />
      <Route path="ProductPosterManage" breadcrumbName="海报管理" component={Poster} />
    </Route>
    <Route breadcrumbName="系统管理" path="System">
      <IndexRedirect to='Version' />
      <Route path="Version" breadcrumbName="版本管理" component={Version} />
      <Route path="Patch" breadcrumbName="补丁管理" component={Patch} />
    </Route>
    <Route path="no-permission" component={ErrorPage} type="no-permission"/>
    <Route path="no-server" component={ErrorPage} type="no-server"/>
    <Route path='*' component={ErrorPage}/>
  </Route>
);

/**
 * 这里用来load reducers
 */
import app from './app/reducers/index'; //app全局
import routing from './app/reducers/routing';
import contentManage from './content-manage/reducer';
import systemManage from './system-manage/reducer';
import updateManage from './update-manage/reducer';
import marketManage from './market-tool/reducer';

const reducers = combineReducers({
  app,
  routing,
  contentManage,
  systemManage,
  updateManage,
  marketManage
});

/**
 * render document
 */
import Root from '../Root'
render(
  <Root routes={routes} reducers={reducers} basename={`${URL_CONTEXT}`} />,
  document.getElementById('layout')
);
