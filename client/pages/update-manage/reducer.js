import {Map, List, fromJS} from 'immutable';

const initialState = fromJS({
  loading: false
});

export default (state = initialState, action) => {

  if (action.type === 'get_version_list') {
    return state.set('versionList', Map(action.data));
  }
  if (action.type === 'get_patch_list') {
    return state.set('patchList', Map(action.data));
  }
  return state;
};
