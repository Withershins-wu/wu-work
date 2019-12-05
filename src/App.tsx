import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Route,
  Switch,
  useLocation,
  useHistory,
  Link,
  Redirect
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Layout, Menu, Breadcrumb, Skeleton, Popover } from "antd";
import { Logo as Lo } from "./components";
import styled from "styled-components";
import "./index.css";

const { Header, Content, Footer } = Layout;

const routes = [
  {
    path: "/questions",
    component: lazy(() => import("./pages/Questions"))
  },
  {
    path: "/explore",
    component: lazy(() => import("./pages/Explore"))
  },
  {
    path: "/practice",
    component: lazy(() => import("./pages/Practice"))
  }
];

const Logo = styled(Lo)`
  height: 31px;
  width: auto;
  margin: 16px 24px 16px 0;
  float: left;
`;
const Logout = styled.div`
  cursor: pointer;
`;
const UserLogo = styled.div`
  text-align: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  right: 20px;
  top: 12px;
  cursor: pointer;
  font-size: 16px;
  line-height: 40px;
  font-weight: 900;
  overflow: hidden;
`;

function App() {
  const location = useLocation();
  const history = useHistory();
  let user = JSON.parse(sessionStorage.getItem("user"));
  useEffect(() => {
    if (user) {
      history.push(
        location.pathname === "/" ? "/questions" : location.pathname
      );
    } else {
      history.push("/login");
    }
  }, []);
  return (
    <Layout style={{ height: "100%" }}>
      <Header>
        <Logo />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="/questions">
            <Link to="/questions">题库</Link>
          </Menu.Item>
          <Menu.Item key="/explore">
            <Link to="/explore">探索</Link>
          </Menu.Item>
          <Menu.Item key="/practice">
            <Link to="/practice">练习</Link>
          </Menu.Item>
        </Menu>
        <Popover
          content={
            <Logout
              onClick={() => {
                sessionStorage.removeItem("user");
                history.push("/login");
              }}
            >
              退出
            </Logout>
          }
        >
          <UserLogo>{user && user.name.slice(-1)}</UserLogo>
        </Popover>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div
          style={{
            background: "#fff",
            padding: 24,
            minHeight: 280,
            margin: "16px 0",
            height: "calc(100% - 40px)",
            overflow: "auto"
          }}
        >
          {/* <TransitionGroup className="router-wrapper">
            <CSSTransition
              timeout={500}
              classNames="fade"
              key={location.pathname}
              unmountOnExit
            > */}
          <Suspense fallback={<Skeleton loading active avatar />}>
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
          </Suspense>

          {/* </CSSTransition>
          </TransitionGroup> */}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        个性化练习导学系统 ©2019 Created by Wu
      </Footer>
    </Layout>
  );
}

export default App;
