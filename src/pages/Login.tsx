import React, { useState } from "react";
import { Form, Button, Checkbox, Input, Icon, message } from "antd";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Logo } from "../components";
import { login, register } from "@/services/login";

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

function Login({ form: { getFieldDecorator, validateFields, getFieldValue } }) {
  const [isRegister, setIsRegister] = useState(false);
  const [confirmDirty, setConfirmDirty] = useState(false);
  const history = useHistory();
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        if (isRegister) {
          // 注册
          register(values).then(data => {
            if (data.code === 200) {
              message.success(data.msg);
              setIsRegister(false);
            } else {
              message.info(data && data.msg);
            }
          });
        } else {
          login({
            email: values.email,
            pwd: values.pwd
          }).then(data => {
            if (data.code === 200) {
              sessionStorage.setItem(
                "user",
                JSON.stringify({ email: values.email })
              );
              history.push("/");
            } else {
              message.info(data && data.msg);
            }
          });
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
            {getFieldDecorator("pwd", {
              rules: [
                { required: true, message: "请输入密码!" },
                {
                  validator(rule, value, callback) {
                    if (value && confirmDirty) {
                      validateFields(["rePwd"], { force: true });
                    }
                    callback();
                  }
                }
              ]
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
          {isRegister && (
            <Form.Item>
              {getFieldDecorator("rePwd", {
                rules: [
                  { required: true, message: "请再次输入密码!" },
                  {
                    validator(rule, value, callback) {
                      if (value && value !== getFieldValue("pwd")) {
                        callback("前后密码不一致");
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon
                      type="safety-certificate"
                      style={{ color: "rgba(0,0,0,.25)" }}
                    />
                  }
                  type="password"
                  onBlur={e => {
                    setConfirmDirty(confirmDirty || !!e.target.value);
                  }}
                  placeholder="重复密码"
                />
              )}
            </Form.Item>
          )}
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
