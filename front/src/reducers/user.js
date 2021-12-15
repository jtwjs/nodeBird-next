export const initialState = {
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
export const FOLLOW_UP_REQUEST = 'FOLLOW_UP_REQUEST';
export const FOLLOW_UP_SUCCESS = 'FOLLOW_UP_SUCCESS';
export const FOLLOW_UP_FAILURE = 'FOLLOW_UP_FAILURE';
export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

const dummyUser = (data) => ({
	...data,
	nickname: 'jtwjs',
	id: 1,
	Posts: [{id: 1}],
	Followings: [{nickname: '부기초'},{nickname: 'Chanho Lee'},{nickname: 'neue zeal'}],
	Followers: [{nickname: '부기초'},{nickname: 'Chanho Lee'},{nickname: 'neue zeal'}],
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

const userReducer =  (state = initialState, action) => {
  switch (action.type) {
  	case SIGN_UP_REQUEST: {
      return {
        ...state,
        logoutLoading: true,
	      logoutDone: false,
	      logoutError: null,
      };
    }

    case SIGN_UP_SUCCESS: {
      return {
        ...state,
        logoutLoading: false,
        logoutDone: true,
        me: null,
      };
    }

    case SIGN_UP_FAILURE: {
      return {
        ...state,
        logoutLoading: false,
        logoutDone: false,
	      logoutError: action.error,
      };
    }

    case LOG_IN_REQUEST: {
      return {
        ...state,
				loginLoading: true,
	      loginError: null,
	      loginDone: false,
      };
    }

    case LOG_IN_SUCCESS: {
      return {
        ...state,
        loginLoading: false,
        loginDone: true,
        me: dummyUser(action.data),
      };
    }

    case LOG_IN_FAILURE: {
      return {
        ...state,
        loginLoading: false,
        loginError: action.error,
	      logoutDone: false,
      };
    }

    case LOG_OUT_REQUEST: {
      return {
        ...state,
        logoutLoading: true,
	      logoutDone: false,
	      logoutError: null,
      };
    }

    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        logoutLoading: false,
        logoutDone: true,
        me: null,
      };
    }

    case LOG_OUT_FAILURE: {
      return {
        ...state,
        logoutLoading: false,
        logoutDone: false,
	      logoutError: action.error,
      };
    }

	  case ADD_POST_TO_ME:
	  	return {
	  		...state,
			  me: {
	  			...state.me,
	  			Posts: [{id: action.data}, ...state.me.Posts],
			  }
		  }

	  case REMOVE_POST_OF_ME:
	  	return {
	  		...state,
			  me: {
	  			...state.me,
				  Posts: state.me.Posts.filter((v) => v.id !== action.data),
			  },
		  }

    default: {
      return {
        ...state,
      }
    }
  }
};

export default userReducer;