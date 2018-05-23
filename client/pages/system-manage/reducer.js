import {Map, List, fromJS} from 'immutable';

const initialState = fromJS({
  loading: false
});

export default (state = initialState, action) => {

  if (action.type === 'get_work_list') {
    return state.set('workList', Map(action.data));
  }
  if (action.type === 'get_subWork_list') {
    return state.set('subWorkList', Map(action.data));
  }
  if (action.type === 'get_work_sort') {
    return state.set('workSort', List(action.data));
  }
  if (action.type === 'get_subWork_sort') {
    return state.set('subSort', List(action.data));
  }
  return state;
};
