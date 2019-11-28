import React, { useState } from "react";
import { Input } from "antd";
import styled from "styled-components";
import { useTransition, animated } from "react-spring";

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
const QuestionWrap = styled.div`
  width: 60%;
  margin-top: 20px;
`;
const Question = styled(animated.div)`
  height: 50px;
  border-radius: 3px;
  line-height: 50px;
  color: #fff;
  padding-left: 32px;
  font-size: 14.5px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px 0px;
  background: linear-gradient(135deg, #3272d7, #c3cfe2);
  margin-bottom: 4px;
`;

interface QuestionI extends G.AnyObject {
  name: string;
  link: string;
}

function Explore() {
  const [questions, setQuestions] = useState<QuestionI[]>([]);
  const transitions = useTransition(
    questions.map((item, index) => ({ ...item, index })),
    item => item.link,
    {
      from: { opacity: 0, transform: "rotateY(180deg)" },
      enter: { opacity: 1, transform: "rotateY(0deg)" },
      leave: { opacity: 0, transform: "rotateY(180deg)" },
      delay: 5000,
      unique: true,
      trail: 25,
      config: { mass: 5, tension: 500, friction: 100 }
    }
  );
  const handleSearch = value => {
    if (value) {
      setQuestions([
        {
          name: "床前明月光",
          link: "1"
        },
        {
          name: "疑是地上霜",
          link: "1"
        }
      ]);
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
      <QuestionWrap>
        {transitions.map(({ item, props, key }) => (
          <Question key={key} style={props}>
            {item && item.name}
          </Question>
        ))}
      </QuestionWrap>
    </Wrap>
  );
}

export default Explore;
