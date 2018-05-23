import {Map, List, fromJS} from 'immutable';

const initialState = fromJS({
  loading: false
});

export default (state = initialState, action) => {

  if (action.type === 'get_holiday_list') {
    return state.set('holidayList', Map(action.data));
  }
  if (action.type === 'get_poster_list') {
    return state.set('posterList', Map(action.data));
  }
  if (action.type === 'get_holiday_name') {
    return state.set('holidayNameList', List(action.data));
  }
  return state;
};
