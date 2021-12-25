import produce from '../util/produce';

export const initialState = {
	followLoading: false, // 팔로우 시도중
  followDone: false,
  followError: null,
	unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,
  loginLoading: false, // 로그인 시도중
  loginDone: false,
  loginError: null,
  logoutLoading: false, // 로그아웃 시도중
  logoutDone: false,
  logoutError: null,
  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,
  me: null,
  signUpData: {},
  loginData: {},
};

export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST'; // 액션의 이름
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS'; // 액션의 이름
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE'; // 액션의 이름
export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_SUCCESS';
// export const FOLLOW_UP_REQUEST = 'FOLLOW_UP_REQUEST';
// export const FOLLOW_UP_SUCCESS = 'FOLLOW_UP_SUCCESS';
// export const FOLLOW_UP_FAILURE = 'FOLLOW_UP_FAILURE';
export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

const dummyUser = (data) => ({
  ...data,
  nickname: 'jtwjs',
  id: 1,
  Posts: [{id: 1}],
  Followings: [{nickname: '부기초'}, {nickname: 'Chanho Lee'}, {nickname: 'neue zeal'}],
  Followers: [{nickname: '부기초'}, {nickname: 'Chanho Lee'}, {nickname: 'neue zeal'}],
})

export const loginRequestAction = (data) => {
  return {
    type: LOG_IN_REQUEST,
    data,
  }
};
export const logoutRequestAction = () => {
  return {
    type: LOG_OUT_REQUEST,
  }
};

const userReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
  	case FOLLOW_REQUEST:
      draft.followLoading = true;
      draft.followDone = false;
      draft.followError = null;
      break;

      case FOLLOW_SUCCESS:
      draft.followLoading = false;
      draft.me.Followings.push({id: action.data});
      draft.followError = null;
      break;

      case FOLLOW_FAILURE:
      draft.followLoading = false;
      draft.followDone = false;
      draft.followError = action.error;
      break;

      case UNFOLLOW_REQUEST:
      draft.unfollowLoading = true;
      draft.unfollowDone = false;
      draft.unfollowError = null;
      break;

      case UNFOLLOW_SUCCESS:
      draft.unfollowLoading = false;
      draft.me.Followings = draft.me.Followings.filter(v => v.id !== action.data);
      draft.unfollowError = null;
      break;

      case UNFOLLOW_FAILURE:
      draft.unfollowLoading = false;
      draft.unfollowDone = false;
      draft.unfollowError = action.error;
      break;

    case SIGN_UP_REQUEST:
      draft.signUpLoading = true;
      draft.signUpDone = false;
      draft.signUpError = null;
      break;

    case SIGN_UP_SUCCESS:
      draft.signUpLoading = false;
      draft.signUpDone = true;
      draft.signUpError = null;
      break;

    case SIGN_UP_FAILURE:
      draft.signUpLoading = false;
      draft.signUpDone = false;
      draft.signUpError = action.error;
      break;

    case LOG_IN_REQUEST:
      draft.loginLoading = true;
      draft.loginError = null;
      draft.loginDone = false;
      break;

    case LOG_IN_SUCCESS:
      draft.loginLoading = false;
      draft.loginDone = true;
      draft.me = dummyUser(action.data);
      break;

    case LOG_IN_FAILURE:
      draft.loginLoading = false;
      draft.loginError = action.error;
      draft.logoutDone = false;
      break;

    case LOG_OUT_REQUEST:
      draft.logoutLoading = true;
      draft.logoutDone = false;
      draft.logoutError = null;
      break;

    case LOG_OUT_SUCCESS:
      draft.logoutLoading = false;
      draft.logoutDone = true;
      draft.me = null;
      break;

    case LOG_OUT_FAILURE:
      draft.logoutLoading = false;
      draft.logoutDone = false;
      draft.logoutError = action.error;
      break;

    case ADD_POST_TO_ME:
      draft.me.Posts.unshift({id: action.data});
      break;

    case REMOVE_POST_OF_ME:
      draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.data);
      break;

    default:
      break;
  }
});

export default userReducer;