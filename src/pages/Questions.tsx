import React, { useState, useEffect } from "react";
import { List, Input, Pagination } from "antd";
import styled from "styled-components";
import { getPractices } from "../services/practice";

const Question = styled(List.Item)`
  justify-content: center;
  i {
    position: absolute;
    left: 5px;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const Avatar = styled.i`
  min-width: 25px;
  height: 25px;
  color: #fff;
  background: #f0ad4e;
  text-align: center;
  font-style: normal;
  font-size: 12px;
  line-height: 25px;
  border-radius: 25px;
  box-shadow: 3px 3px 5px #515629;
`;
const Search = styled(Input.Search)`
  && {
    width: 230px;
    margin-bottom: 15px;
  }
`;
const QuestionList = styled(List)`
  && {
    max-height: calc(100% - 90px);
    overflow: overlay;
  }
`;

function Questions() {
  const [data, setData] = useState<any>({ total: 0, rowsList: [] });
  const [params, setParams] = useState({ pageSize: 10, pageNum: 1, title: "" });
  useEffect(() => {
    getPractices(params).then(res => {
      if (res.code === 200) {
        setData(res.data);
      }
    });
  }, [params]);
  return (
    <>
      <Search
        placeholder="搜索题库..."
        onSearch={title =>
          setParams(params => ({ ...params, pageNum: 1, title }))
        }
      />
      <QuestionList
        itemLayout="horizontal"
        dataSource={data.rowsList}
        renderItem={(item, index) => (
          <Question>
            <Avatar>{10 * (params.pageNum - 1) + index + 1}</Avatar>
            <a href={item.url}>{item.title}</a>
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
    </>
  );
}

export default Questions;
