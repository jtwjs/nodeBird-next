const dummyUser = {
  id: 1,
  nickname: '제로초',
  Posts: [],
  Followings: [],
  Followers: [],
};

export const initialState = {
  isLoggedIn: false,
  isLoggingIn: false,
  isLoggingOut: false,
  me: null,
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST'; // 액션의 이름
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS'; // 액션의 이름
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE'; // 액션의 이름
export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_SUCCESS';

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
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
      };
    }

    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: {...action.data, nickname: 'jtwjs'},
      };
    }

    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
      };
    }

    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggingOut: true,
      };
    }

    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
        me: null,
      };
    }

    case LOG_OUT_FAILURE: {
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
      };
    }

    default: {
      return {
        ...state,
      }
    }
  }
};

export default userReducer;