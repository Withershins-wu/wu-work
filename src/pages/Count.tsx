import React from "react";
import { useDispatch, useSelector } from "react-redux";

function Count() {
  const state = useSelector(
    (state: any) => state,
    function(left, right) {
      return left === right;
    }
  );
  const dispatch = useDispatch();
  return (
    <>
      <p>GLobal</p>
      <button onClick={() => dispatch({ type: "global/addEffect" })}>
        add after 1s
      </button>
      <button onClick={() => dispatch({ type: "global/add" })}>add</button>
      <button onClick={() => dispatch({ type: "global/sub" })}>sub</button>
      <h1>{state.global.count}</h1>
    </>
  );
}

export default Count;
