import {Map, List, fromJS} from 'immutable';

const initialState = fromJS({
  loading: false
});

export default (state = initialState, action) => {

  if (action.type === 'get_news_list') {
    return state.set('newsList', Map(action.data));
  }
  if (action.type === 'get_carousel_list') {
    return state.set('carouselList', Map(action.data));
  }
  if (action.type === 'get_notice_list') {
    return state.set('noticeList', Map(action.data));
  }
  if (action.type === 'get_banner_sort') {
    return state.set('bannerSort', List(action.data));
  }
  if (action.type === 'get_city_list') {
    const list = List(action.data);
    const result = list.filter(v => v.cityName !== '测试城市' && v.cityName !== '理房通');
    return state.set('cityList', result);
  }
  if (action.type === 'get_advert_list') {
    return state.set('advertList', Map(action.data));
  }
  if (action.type === 'get_sign_list') {
    return state.set('signList', Map(action.data));
  }
  if (action.type === 'get_sign_sort') {
    return state.set('signSort', List(action.data));
  }
  if (action.type === 'get_video_list') {
    return state.set('videoList', Map(action.data));
  }
  if (action.type === 'get_video_sort') {
    return state.set('videoSort', List(action.data));
  }
  if (action.type === 'get_subSign_list') {
    return state.set('subSignList', Map(action.data));
  }
  if (action.type === 'get_subSign_sort') {
    return state.set('subSignSort', List(action.data));
  }
  return state;
};
