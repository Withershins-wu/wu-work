import React, { useState, useEffect } from "react";
import {
  List,
  Input,
  Pagination,
  Button,
  Modal,
  Form,
  Radio,
  Select
} from "antd";
import styled from "styled-components";
import {
  getPracticesHistory,
  addPracticesHistory,
  getPractices
} from "../services/practice";

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

interface Data {
  total: number;
  rowsList: Array<{ id: number; title: string; url: string; status: number }>;
}

function Practice({
  form: { getFieldDecorator, validateFields, resetFields }
}) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [vis, setVis] = useState<boolean>(false);
  const [data, setData] = useState<any>({ total: 0, rowsList: [] });
  const [questions, setQuestions] = useState<any>([]);
  const [params, setParams] = useState<any>({
    id: user.id,
    pageNum: 1,
    pageSize: 10
  });
  const handleSubmit = () => {
    validateFields((err, values) => {
      if (!err) {
        addPracticesHistory({ ...values, userId: user.id }).then(res => {
          if (res.code === 200) {
            setVis(false);
            setParams({ id: user.id, pageNum: 1, pageSize: 10 });
          }
        });
      }
    });
  };
  useEffect(() => {
    getPracticesHistory(params).then(res => {
      if (res.code === 200) {
        setData(res.data);
      }
    });
  }, [params]);
  useEffect(() => {
    getPractices({}).then(res => {
      if (res.code === 200) {
        setQuestions(res.data.rowsList);
      }
    });
  }, []);
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
        dataSource={data.rowsList}
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
      {data.total > 0 && (
        <Pagination
          style={{ textAlign: "center", marginTop: 5 }}
          simple
          current={params.pageNum}
          total={data.tota}
          onChange={pageNum => setParams(params => ({ ...params, pageNum }))}
        />
      )}
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
            {getFieldDecorator("title", {
              rules: [{ required: true, message: "请输入题目名称或编号" }]
            })(
              <Select placeholder="请输入题目名称或编号">
                {questions.map(item => (
                  <Select.Option key={item.title}>{item.title}</Select.Option>
                ))}
              </Select>
            )}
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
