import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Spin } from "antd";
import dva from "./dva/index";
import global from "./models/global";
import "./index.css";

const app = dva();
app.model(global);
app.start();

const App = lazy(() => import("./App"));
const Login = lazy(() => import("./pages/Login"));

ReactDOM.render(
  <Provider store={app.store}>
    <Router>
      <Suspense fallback={<Spin style={{ marginTop: "30%", marginLeft: '50%', transform: 'translate(-50%, -50%)' }} spinning />}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={App} />
        </Switch>
      </Suspense>
    </Router>
  </Provider>,
  (document as Document).getElementById("root")
);

serviceWorker.unregister();
