import { useEffect, useReducer } from "react";
import Headers from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Question from "./Question.js";
import NextButton from "./NextButton.js";
import Progress from "./Progress.js";
import FinishScreen from "./FinishScreen.js";

const initialState = {
  questions: [],
  status: "loading",
  message: null,
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      // console.log(state);
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFaild":
      console.log(state);
      return { ...state, status: "error", message: action.payload };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const currentQuestion = state.questions.at(state.index);
      // console.log(currentQuestion);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currentQuestion.correctOption
            ? state.points + currentQuestion.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finish",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      // Both are correct
      // return { ...state, status: "ready", index: 0, answer: null };
      return { ...initialState, questions: state.questions, status: "ready" };
    default:
      throw new Error("Action unknown");
  }
}
// console.log(initialState);

export default function App() {
  const [
    { questions, status, message, index, answer, points, highscore },
    dispatch,
  ] = useReducer(reducer, initialState);
  console.log(answer);
  console.log(index);
  const numQuestions = questions.length;

  // Second Way
  // const numpoints = questions.map((el) => el.points);
  const maxPoints = questions.reduce((acc, cur) => acc + cur.points, 0);
  console.log(maxPoints);

  useEffect(function () {
    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFaild", payload: err.message });
      }
    }

    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Headers />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error>❗ERROR: {message} ❌</Error>}
        {status === "ready" && (
          <StartScreen num={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numQuestions}
            />
          </>
        )}
        {status === "finish" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
