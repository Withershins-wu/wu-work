import React, { useState } from "react";
import { List, Input, Pagination, Button, Modal, Form, Radio } from "antd";
import styled from "styled-components";

const data = [
  {
    name: "Two Sum",
    link: "/1"
  },
  {
    name: "Three Sum",
    link: "/1"
  },
  {
    name: "Four Sum",
    link: "/1"
  },
  {
    name: "Two Sum",
    link: "/1"
  },
  {
    name: "Three Sum",
    link: "/1"
  },
  {
    name: "Four Sum",
    link: "/1"
  },
  {
    name: "Two Sum",
    link: "/1"
  },
  {
    name: "Three Sum",
    link: "/1"
  },
  {
    name: "Four Sum",
    link: "/1"
  }
];

const Question = styled(List.Item)`
  && {
    padding: 12px 10px;
    justify-content: space-between;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
`;

const Avatar = styled.i`
  width: 25px;
  height: 25px;
  color: #fff;
  background: #f0ad4e;
  text-align: center;
  font-style: normal;
  font-size: 14px;
  line-height: 25px;
  border-radius: 50%;
  box-shadow: 3px 3px 5px #515629;
`;
const QuestionList = styled(List)`
  && {
    max-height: calc(100% - 80px);
    overflow: overlay;
  }
`;

function Practice({
  form: { getFieldDecorator, validateFields, resetFields }
}) {
  const [vis, setVis] = useState(false);
  const [records, setRecords] = useState([]);
  const handleSubmit = () => {
    validateFields((err, values) => {
      if (!err) {
        setRecords([values]);
        setVis(false);
      }
    });
  };
  return (
    <>
      <Button
        onClick={() => setVis(true)}
        type="primary"
        icon="plus"
        style={{ marginBottom: 10 }}
      >
        添加记录
      </Button>
      <QuestionList
        itemLayout="horizontal"
        dataSource={records}
        renderItem={(item, index) => (
          <Question>
            <Avatar>{index}</Avatar>
            <a href={item.link || ""}>{item.name}</a>
            <span style={{ color: item.status ? "#1fa91f" : "#ef3d3d" }}>
              {item.status ? "通过" : "未通过"}
            </span>
          </Question>
        )}
      />
      <Pagination
        style={{ textAlign: "center", marginTop: 5 }}
        simple
        defaultCurrent={2}
        total={50}
      />
      <Modal
        title="添加记录"
        visible={vis}
        onOk={handleSubmit}
        onCancel={() => setVis(false)}
        cancelText="取消"
        okText="提交"
        afterClose={() => resetFields()}
      >
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item label="题目">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入题目名称或编号" }]
            })(<Input placeholder="请输入题目名称或编号" />)}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator("status", {
              rules: [{ required: true, message: "请选择" }]
            })(
              <Radio.Group>
                <Radio value={1}>通过</Radio>
                <Radio value={0}>未通过</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Form.create()(Practice);
