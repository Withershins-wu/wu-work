import React from "react";
import { List, Input, Pagination } from "antd";
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
  justify-content: center;
  i {
    position: absolute;
    left: 5px;
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
const Search = styled(Input.Search)`
  && {
    width: 250px;
    margin-bottom: 15px;
  }
`;
const QuestionList = styled(List)`
  && {
    height: calc(100% - 90px);
    overflow: auto;
  }
`;

function Questions() {
  return (
    <>
      <Search
        placeholder="搜索题库..."
        onSearch={value => console.log(value)}
      />
      <QuestionList
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <Question>
            <Avatar>{index}</Avatar>
            <a href={item.link}>{item.name}</a>
          </Question>
        )}
      />
      <Pagination
        style={{ textAlign: "center", marginTop: 5 }}
        simple
        defaultCurrent={2}
        total={50}
      />
    </>
  );
}

export default Questions;
