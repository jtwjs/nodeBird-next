import {all, delay, fork, call, put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';

import {
	SIGN_UP_REQUEST,
	SIGN_UP_SUCCESS,
	SIGN_UP_FAILURE,
	LOG_IN_FAILURE,
	LOG_IN_REQUEST,
	LOG_IN_SUCCESS,
	LOG_OUT_FAILURE,
	LOG_OUT_REQUEST,
	LOG_OUT_SUCCESS,
	FOLLOW_REQUEST,
	FOLLOW_SUCCESS,
	FOLLOW_FAILURE,
	UNFOLLOW_REQUEST,
	UNFOLLOW_SUCCESS,
	UNFOLLOW_FAILURE,
	LOAD_MY_INFO_REQUEST,
	LOAD_MY_INFO_SUCCESS,
	LOAD_MY_INFO_FAILURE,
	CHANGE_NICKNAME_REQUEST,
	CHANGE_NICKNAME_FAILURE,
	CHANGE_NICKNAME_SUCCESS,
	LOAD_FOLLOWERS_REQUEST,
	LOAD_FOLLOWINGS_REQUEST,
	LOAD_FOLLOWERS_SUCCESS,
	LOAD_FOLLOWERS_FAILURE,
	LOAD_FOLLOWINGS_SUCCESS,
	LOAD_FOLLOWINGS_FAILURE,
	REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_FAILURE, REMOVE_FOLLOWER_SUCCESS,
} from '../reducers/user';

function removeFollowerAPI(data) {
	return axios.delete(`user/follower/${data}`);
}

function* removeFollower(action) {
	try {
		const result = yield call(removeFollowerAPI, action.data);
		yield put({
			type: REMOVE_FOLLOWER_SUCCESS,
			data: result.data,
		})
	} catch(err) {
		console.error(err);
		yield put({
			type: REMOVE_FOLLOWER_FAILURE,
			data: err.response.data,
		})
	}
}

function loadFollowersAPI() {
	return axios.get('user/followers');
}

function* loadFollowers() {
	try {
		const result = yield call(loadFollowersAPI);
		yield put({
			type: LOAD_FOLLOWERS_SUCCESS,
			data: result.data,
		})
	} catch(err) {
		console.error(err);
		yield put({
			type: LOAD_FOLLOWERS_FAILURE,
			data: err.response.data,
		})
	}
}

function loadFollowingsAPI() {
	return axios.get('user/followings');
}

function* loadFollowings() {
	try {
		const result = yield call(loadFollowingsAPI);
		yield put({
			type: LOAD_FOLLOWINGS_SUCCESS,
			data: result.data,
		})
	} catch(err) {
		console.error(err);
		yield put({
			type: LOAD_FOLLOWINGS_FAILURE,
			data: err.response.data,
		})
	}
}

function changeNicknameAPI(data) {
	return axios.patch('user/nickname', {nickname: data});
}

function* changeNickname(action) {
	try {
		const result = yield call(changeNicknameAPI, action.data);
		yield put({
			type: CHANGE_NICKNAME_SUCCESS,
			data: result.data,
		})
	} catch(err) {
		console.error(err);
		yield put({
			type: CHANGE_NICKNAME_FAILURE,
			data: err.response.data,
		})
	}
}

function loadMyInfoAPI(data) {
	return axios.get('/user', data);
}

function* loadMyInfo(action) {
	try {
		const result = yield call(loadMyInfoAPI, action.data);
		yield put({
			type: LOAD_MY_INFO_SUCCESS,
			data: result.data,
		})
	} catch(err) {
		console.error(err);
		yield put({
			type: LOAD_MY_INFO_FAILURE,
			data: err.response.data,
		})
	}
}

function signupAPI(data) {
  return axios.post('/user', data);
}

function* signup(action) {
  try {
    const result = yield call(signupAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    })
  }
}

function logInAPI(data) {
  return axios.post('/user/login', data);
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('/user/logout');
}

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    })
  }
}

function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`);
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    })
  }
}

function* watchRemoveFollower() {
	yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function* watchLoadFollowers() {
	yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers)
}

function* watchLoadFollowings() {
	yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings)
}

function* watchChangeNickname() {
	yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname)
}

function* watchLoadMyInfo() {
	yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo)
}

function* watchSignup() {
  yield takeLatest(SIGN_UP_REQUEST, signup);
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

export default function* userSaga() {
  yield all([
  	fork(watchRemoveFollower),
  	fork(watchLoadFollowers),
  	fork(watchLoadFollowings),
  	fork(watchChangeNickname),
  	fork(watchLoadMyInfo),
    fork(watchSignup),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchFollow),
    fork(watchUnfollow),
  ]);
}