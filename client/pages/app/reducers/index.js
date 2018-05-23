import {Map, List, fromJS} from 'immutable';

const initialState = fromJS({
  loading: false
});

export default (state = initialState, action) => {

  if (action.type === 'app_loading') {
    return state.set('loading', action.status);
  }
  if (action.type === 'get_user_info') {
    return state.set('userInfo', Map(action.data));
  }
  if (action.type === 'get_user_permission') {
    return state.set('permissionInfo', Map(action.data));
  }
  return state;
};
