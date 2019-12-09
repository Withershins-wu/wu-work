import React, { useState, useEffect } from "react";
import { Input } from "antd";
import styled from "styled-components";
import { useTransition, useSpring, animated } from "react-spring";
import { getLikePractices, getRecommendPractices } from "../services/practice";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Search = styled(Input.Search)`
  && {
    width: 80%;
    margin-left: 10%;
  }
`;
const RecommendWrap = styled.div`
  width: 60%;
  margin-top: 10px;
  display: flex;
  div {
    font-weight: bold;
  }
  div,
  a {
    margin-right: 10px;
  }
`;
const Recommend = styled(animated.a)``;
const QuestionWrap = styled.div`
  width: 60%;
  margin-top: 20px;
`;
const Question = styled(animated.a)`
  display: flex;
  height: 40px;
  border-radius: 3px;
  line-height: 40px;
  color: #fff;
  padding-left: 32px;
  font-size: 14.5px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px 0px;
  background: linear-gradient(135deg, #269562, #2c2c29);
  margin-bottom: 4px;
  &:hover {
    color: #fff;
    transform: scale(1.1) !important;
    transition: transform 0.2s ease;
  }
`;

interface QuestionI extends G.AnyObject {
  title: string;
  id: string | number;
  url: string;
}

function Explore() {
  const [questions, setQuestions] = useState<QuestionI[]>([]);
  const [recommends, setRecommends] = useState<QuestionI[]>([]);
  useEffect(() => {
    const { id: userId } = JSON.parse(sessionStorage.getItem("user"));
    getRecommendPractices({ userId }).then(res => {
      if (res.code === 200) {
        setRecommends(res.data as QuestionI[]);
      }
    });
  }, []);
  const transitions = useTransition(
    questions.map((item, index) => ({ ...item, index })),
    item => item.url,
    {
      from: {
        opacity: 0,
        transform: "skew(10deg, 0deg) translate(-20px, -20px)"
      },
      enter: {
        opacity: 1,
        transform: "skew(0deg, 0deg) translate(0, 0)"
      },
      leave: {
        opacity: 0,
        transform: "skew(10deg, 0deg) translate(20px,20px)"
      },
      unique: true,
      trail: 50,
      config: { mass: 5, tension: 500, friction: 100 }
    }
  );
  const recommendTransitions = useTransition(
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
  const handleSearch = value => {
    if (value) {
      getLikePractices({ title: value }).then(res => {
        if (res.code === 200) {
          setQuestions(res.data.rowsList);
        }
      });
    } else {
      setQuestions([]);
    }
  };
  return (
    <Wrap>
      <Search
        size="large"
        placeholder="搜索类似题目..."
        onSearch={handleSearch}
      />
      {recommends.length > 0 && (
        <RecommendWrap>
          <div>推荐:</div>
          {recommendTransitions.map(({ item, props, key }) => (
            <Recommend key={key} style={props} href={item.url}>
              {item && item.title}
            </Recommend>
          ))}
        </RecommendWrap>
      )}
      <QuestionWrap>
        {transitions.map(({ item, props, key }) => (
          <Question key={key} style={props} href={item.url}>
            {item && item.title}
          </Question>
        ))}
      </QuestionWrap>
    </Wrap>
  );
}

export default Explore;
