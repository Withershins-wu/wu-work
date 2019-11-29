import React, { useState } from "react";
import { Form, Button, Checkbox, Input, Icon } from "antd";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Logo } from "../components";



const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5vh;
`;
const Box = styled.div`
  border: 1px solid #d8dee2;
  border-radius: 5px;
  width: 280px;
  height: auto;
  padding: 20px;
  background: #fff;
`;

function Login({ form: { getFieldDecorator, validateFields } }) {
  const [isRegister, setIsRegister] = useState(false);
  const history = useHistory();
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        if (isRegister) {
          // 注册
        } else {
          history.push("/");
        }
      }
    });
  };
  return (
    <Wrap>
      <Logo />
      <h2>Leet Code</h2>
      <Box>
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [
                { required: true, message: "请输入邮箱!" },
                {
                  pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                  message: "格式错误!"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="邮箱"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "请输入密码!" }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="密码"
              />
            )}
          </Form.Item>
          <Form.Item>
            {!isRegister &&
              getFieldDecorator("remember", {
                valuePropName: "checked",
                initialValue: true
              })(<Checkbox>记住</Checkbox>)}
            {!isRegister && (
              <a style={{ float: "right" }} href="">
                忘记密码？
              </a>
            )}
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {isRegister ? "注册" : "登录"}
            </Button>
            {isRegister ? "已有账号 " : "还没有账号 "}
            <a href="javascript:;" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "立刻登录!" : "立刻注册!"}
            </a>
          </Form.Item>
        </Form>
      </Box>
    </Wrap>
  );
}
export default Form.create()(Login);
