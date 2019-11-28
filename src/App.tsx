import React, { lazy } from "react";
import { Route, Switch, useLocation, Link, Redirect } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./index.css";

const routes = [
  {
    path: "/practice",
    component: lazy(() => import("./pages/Count"))
  }
];

function App() {
  const location = useLocation();
  return (
    <>
      <h1 style={{ textAlign: "center" }}>header</h1>
      <Link to="/practice">Count</Link>
      <TransitionGroup className="router-wrapper">
        <CSSTransition
          timeout={500}
          classNames="fade"
          key={location.pathname}
          unmountOnExit
        >
          <Switch location={location}>
            {routes.map(route => (
              <Route
                key={route.path}
                exact
                path={route.path}
                component={route.component}
              />
            ))}
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
}

export default App;
