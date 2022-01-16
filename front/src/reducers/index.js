import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";

import user from "./user";
import post from "./post";

const rootReducer = (state, action) => {
  // 루트 리듀서의 전체 상태를 덮어씌우기 위함
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return action.payload;

    default: {
      const combineReducer = combineReducers({
        user,
        post,
      });
      return combineReducer(state, action);
    }
  }
};

export default rootReducer;