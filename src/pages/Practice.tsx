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
import { useTransition, useSpring, animated } from "react-spring";
import debounce from 'lodash/debounce';
import styled from "styled-components";
import {
  getPracticesHistory,
  addPracticesHistory,
  getPractices,
  getRecommendPractices
} from "../services/practice";

const RecommendWrap = styled.div`
  display: inline-flex;
  margin-left: 20px;
  div {
    font-weight: bold;
  }
  div,
  a {
    margin-right: 10px;
  }
`;
const Recommend = styled(animated.a)``;
const Question = styled(List.Item)`
  && {
    padding: 12px 10px;
    justify-content: center;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    i {
      position: absolute;
      left: 5px;
    }
    span {
      position: absolute;
      right: 0;
      width: 60px;
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

interface QuestionI extends G.AnyObject {
  title: string;
  id: string | number;
  url: string;
}

function Practice({
  form: { getFieldDecorator, validateFields, resetFields }
}) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [vis, setVis] = useState<boolean>(false);
  const [data, setData] = useState<any>({ total: 0, rowsList: [] });
  const [questions, setQuestions] = useState<any>([]);
  const [recommends, setRecommends] = useState<QuestionI[]>([]);
  const [refresh, setRefresh] = useState({});
  const [params, setParams] = useState<any>({
    userId: user.id,
    pageNum: 1,
    pageSize: 10
  });
  const [title, setTitle] = useState("");

  useEffect(() => {
    const { id: userId } = JSON.parse(sessionStorage.getItem("user"));
    getRecommendPractices({ userId }).then(res => {
      if (res.code === 200) {
        setRecommends(res.data as QuestionI[]);
      }
    });
  }, [refresh]);

  const handleSubmit = () => {
    validateFields((err, values) => {
      if (!err) {
        addPracticesHistory({ ...values, userId: user.id }).then(res => {
          if (res.code === 200) {
            setVis(false);
            setParams({ userId: user.id, pageNum: 1, pageSize: 10 });
            setRefresh({});
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
    if (!title) {
      setQuestions([]);
    } else {
      getPractices({ title }).then(res => {
        if (res.code === 200) {
          setQuestions(res.data.rowsList.slice(0, 50));
        }
      });
    }
  }, [title]);

  const transitions = useTransition(
    recommends.map((item, index) => ({ ...item, index })),
    item => item.url,
    {
      from: {
        opacity: 0
      },
      enter: {
        opacity: 1
      },
      leave: {
        opacity: 0
      },
      unique: true,
      trail: 50,
      config: { mass: 5, tension: 500, friction: 100 }
    }
  );

  return (
    <>
      <div>
        <Button
          onClick={() => setVis(true)}
          type="primary"
          icon="plus"
          style={{ marginBottom: 10 }}
        >
          添加记录
        </Button>
        {recommends.length > 0 && (
          <RecommendWrap>
            <div style={{width: 40}}>推荐:</div>
            {transitions.map(({ item, props, key }) => (
              <Recommend key={key} style={props} href={item.url}>
                {item && item.title}
              </Recommend>
            ))}
          </RecommendWrap>
        )}
      </div>

      <QuestionList
        itemLayout="horizontal"
        dataSource={data.rowsList}
        renderItem={(item, index) => (
          <Question>
            <Avatar>{index + 1}</Avatar>
            <a href={item.url || ""}>{item.title}</a>
            <span style={{ color: item.status ? "#1fa91f" : "#ef3d3d" }}>
              {item.status ? "通过" : "未通过"}
            </span>
          </Question>
        )}
      />
      {data.total > 0 && (
        <Pagination
          style={{ textAlign: "center", marginTop: 20 }}
          simple
          current={params.pageNum}
          total={data.total}
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
              <Select
                showSearch
                onSearch={debounce(val => setTitle(val), 500)}
                notFoundContent={null}
                showArrow={false}
                placeholder="请输入题目名称或编号"
              >
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
