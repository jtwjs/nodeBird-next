import produce from '../util/produce';

export const initialState = {
	loadUserInfoLoading: false, // 유저정보 가져오기 시도중
	loadUserInfoDone: false,
	loadUserInfoError: null,
	loadMyInfoLoading: false, // 내정보 가져오기 시도중
	loadMyInfoDone: false,
	loadMyInfoError: null,
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
	changeNicknameLoading: false,
	changeNicknameError: null,
	changeNicknameDone: false,
	loadFollowersLoading: false,
	loadFollowersDone: false,
	loadFollowersError: null,
	loadFollowingsLoading: false,
	loadFollowingsDone: false,
	loadFollowingsError: null,
	removeFollowingLoading: false,
	removeFollowingDone: false,
	removeFollowingError: null,
	me: null,
	signUpData: {},
	loginData: {},
	userInfo: null,
};

export const LOAD_USER_INFO_REQUEST = "LOAD_USER_INFO_REQUEST";
export const LOAD_USER_INFO_SUCCESS = "LOAD_USER_INFO_SUCCESS";
export const LOAD_USER_INFO_FAILURE = "LOAD_USER_INFO_FAILURE";
export const LOAD_MY_INFO_REQUEST = "LOAD_MY_INFO_REQUEST";
export const LOAD_MY_INFO_SUCCESS = "LOAD_MY_INFO_SUCCESS";
export const LOAD_MY_INFO_FAILURE = "LOAD_MY_INFO_FAILURE";
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
export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

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
		case LOAD_USER_INFO_REQUEST:
			draft.loadUserInfoLoading = true;
			draft.loadUserInfoDone = false;
			draft.loadUserInfoError = null;
			break;

		case LOAD_USER_INFO_SUCCESS:
			draft.loadUserInfoLoading = false;
			draft.userInfo = action.data;
			draft.loadUserInfoDone = true;
			draft.loadUserInfoError = null;
			break;

		case LOAD_USER_INFO_FAILURE:
			draft.loadUserInfoLoading = false;
			draft.loadUserInfoDone = false;
			draft.loadUserInfoError = action.error;
			break;

		case REMOVE_FOLLOWER_REQUEST:
			draft.removeFollowerLoading = true;
			draft.removeFollowerDone = false;
			draft.removeFollowerError = null;
			break;

		case REMOVE_FOLLOWER_SUCCESS:
			draft.removeFollowerLoading = false;
			draft.me.Followers = draft.me.Followers.filter(v => v.id !== action.data);
			draft.removeFollowerDone = true;
			draft.removeFollowerError = null;
			break;

		case REMOVE_FOLLOWER_FAILURE:
			draft.removeFollowerLoading = false;
			draft.removeFollowerDone = false;
			draft.removeFollowerError = action.error;
			break;

		case LOAD_FOLLOWERS_REQUEST:
			draft.loadFollowersLoading = true;
			draft.loadFollowersDone = false;
			draft.loadFollowersError = null;
			break;

		case LOAD_FOLLOWERS_SUCCESS:
			draft.loadFollowersLoading = false;
			draft.me.Followers = action.data;
			draft.loadFollowersDone = true;
			draft.loadFollowersError = null;
			break;

		case LOAD_FOLLOWERS_FAILURE:
			draft.loadFollowersLoading = false;
			draft.loadFollowersDone = false;
			draft.loadFollowersError = action.error;
			break;

		case LOAD_FOLLOWINGS_REQUEST:
			draft.loadFollowingsLoading = true;
			draft.loadFollowingsDone = false;
			draft.loadFollowingsError = null;
			break;

		case LOAD_FOLLOWINGS_SUCCESS:
			draft.loadFollowingsLoading = false;
			draft.loadFollowingsDone = true;
			draft.me.Followings = action.data;
			draft.loadFollowingsError = null;
			break;

		case LOAD_FOLLOWINGS_FAILURE:
			draft.loadFollowingsLoading = false;
			draft.loadFollowingsDone = false;
			draft.loadFollowingsError = action.error;
			break;

		case FOLLOW_REQUEST:
			draft.followLoading = true;
			draft.followDone = false;
			draft.followError = null;
			break;

		case FOLLOW_SUCCESS:
			draft.followLoading = false;
			draft.me.Followings.push({id: action.data.UserId});
			draft.followError = null;
			break;

		case FOLLOW_FAILURE:
			draft.followLoading = false;
			draft.followDone = false;
			draft.followError = action.error;
			break;

		case LOAD_MY_INFO_REQUEST:
			draft.loadMyInfoLoading = true;
			draft.loadMyInfowDone = false;
			draft.loadMyInfoError = null;
			break;

		case LOAD_MY_INFO_SUCCESS:
			draft.loadMyInfoLoading = false;
			draft.me = action.data;
			draft.loadMyInfoError = null;
			break;

		case LOAD_MY_INFO_FAILURE:
			draft.loadMyInfoLoading = false;
			draft.loadMyInfoDone = false;
			draft.loadMyInfoError = action.error;
			break;

		case UNFOLLOW_REQUEST:
			draft.unfollowLoading = true;
			draft.unfollowDone = false;
			draft.unfollowError = null;
			break;

		case UNFOLLOW_SUCCESS:
			draft.unfollowLoading = false;
			draft.me.Followings = draft.me.Followings.filter(v => v.id !== action.data.UserId);
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
			draft.me = action.data;
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
			draft.loginDone = false;
			draft.me = null;
			break;

		case LOG_OUT_FAILURE:
			draft.logoutLoading = false;
			draft.logoutDone = false;
			draft.logoutError = action.error;
			break;

		case CHANGE_NICKNAME_REQUEST:
			draft.changeNicknameLoading = true;
			draft.changeNicknameDone = false;
			draft.changeNicknameError = null;
			break;

		case CHANGE_NICKNAME_SUCCESS:
			draft.changeNicknameLoading = false;
			draft.changeNicknameDone = true;
			draft.me.nickname = action.data.nickname;
			break;

		case CHANGE_NICKNAME_FAILURE:
			draft.changeNicknameLoading = false;
			draft.changeNicknameDone = false;
			draft.changeNicknameError = action.error;
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