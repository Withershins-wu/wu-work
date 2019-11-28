import { Action, Dispatch } from "redux";
import { Model } from "../dva";

const model: Model = {
  namespace: "global",
  state: {
    count: 0
  },
  reduces: {
    add(state, action: Action) {
      return { ...state, count: state.count + 1 };
    },
    sub(state, action: Action) {
      return { ...state, count: state.count - 1 };
    }
  },
  effects: {
    *addEffect(action: Action, { call, put, delay }: G.AnyObject) {
      yield delay(1000);
      yield put({ type: "add" });
    }
  },
  subscriptions: {
    init({ dispatch }: { dispatch: Dispatch }) {
      dispatch({ type: "add" });
    }
  }
};
export default model;
