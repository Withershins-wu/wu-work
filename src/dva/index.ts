import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { take, put, call, select, fork, delay } from "redux-saga/effects";
import { Reducer, Action, ReducersMapObject, Store, Dispatch } from "redux";

// Model 初始化钩子
export interface Subscripter extends G.AnyObject<(...args: any[]) => any> {}
// Model
export interface Model {
  namespace: string;
  state: any;
  reduces: G.AnyObject<Reducer>;
  effects: G.AnyObject;
  subscriptions: Subscripter;
}
export interface App {
  model: typeof model;
  start: typeof start;
  store: Store | null;
  dispatch: Dispatch | null;
}
// 暂存 app.model的model, start之后载入
const models: Model[] = [];

// app.model
function model(model: Model) {
  models.push(model);
}

// 载入model
function applyModel(
  models: Model[]
): {
  reducers: ReducersMapObject;
  tasks: (() => Generator)[];
  subscriptions: [Subscripter, string][];
} {
  // reducers: 对应redux的reducer， tasks: saga的watch, subscriptions: 初始化钩子
  const reducers: ReducersMapObject = {};
  const tasks: (() => Generator)[] = [];
  const subscriptions: [Subscripter, string][] = [];
  // 遍历处理
  models.forEach(model => {
    // 钩子先暂存，redux store生成之后再执行
    subscriptions.push([model.subscriptions, model.namespace]);
    // 加入reducers, {a: aReducer, b: bReducer}, 方便combineReducers
    reducers[model.namespace] = function(
      state: any = model.state,
      action: Action
    ) {
      // @@ 一般是saga启动的action, 不进行reducer处理
      if (!action.type.includes("@@")) {
        // action: {namespace}/{name} | e. global/add
        const [namespace, type] = action.type.split("/");
        if (model.reduces[type] && namespace === model.namespace) {
          return model.reduces[type](state, action);
        }
        return state;
      }
      return state;
    };

    // 重写put方法，加入namespace前缀
    const _put = function*(action: Action) {
      yield put({ ...action, type: `${model.namespace}/${action.type}` });
    };
    // take每个model，分别监听
    tasks.push(function*() {
      while (true) {
        const action: any = yield take((action: Action) =>
          action.type.startsWith(model.namespace)
        );
        // 获取无前缀的action type
        const [namespace, type] = action.type.split("/");
        if (namespace !== model.namespace) {
          continue;
        }
        // 调用effect
        if (model.effects[type]) {
          yield call(model.effects[type], action, {
            call,
            put: _put,
            select,
            fork,
            delay
          } as G.AnyObject);
        }
      }
    });
  });
  return { reducers, tasks, subscriptions };
}

function start(this: App) {
  // 生成saga middleware
  const sagaMiddleware = createSagaMiddleware();
  const { reducers, tasks, subscriptions } = applyModel(models);
  this.store = createStore(
    combineReducers(reducers),
    compose(
      applyMiddleware(sagaMiddleware),
      (window as any).__REDUX_DEVTOOLS_EXTENSION__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
        : next => next
    )
  );
  // 执行task任务，启动监听
  tasks.forEach(task => sagaMiddleware.run(task));
  this.dispatch = this.store.dispatch;
  // 执行钩子函数
  subscriptions.forEach(subscripter => {
    const namespace = subscripter[1];
    const dispatch = (action: Action) => {
      this.store.dispatch({ ...action, type: `${namespace}/${action.type}` });
    };
    Object.keys(subscripter[0]).forEach(key => {
      subscripter[0][key]({ dispatch });
    });
  });
  return this.store;
}
export default function dva() {
  const app: App = {
    model,
    start,
    store: null,
    dispatch: null
  };
  return app;
}
