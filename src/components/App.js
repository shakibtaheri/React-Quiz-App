import { useEffect, useReducer } from "react";
import Headers from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Question from "./Question.js";
import NextButton from "./NextButton.js";
import Progress from "./progress.js";

const initialState = {
  questions: [],
  status: "loading",
  message: null,
  index: 0,
  answer: null,
  points: 0,
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
    default:
      throw new Error("Action unknown");
  }
}
// console.log(initialState);

export default function App() {
  const [{ questions, status, message, index, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );
  console.log(answer);
  console.log(index);
  const numQuestions = questions.length;

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

  //Second way fewtch data with catch error

  // useEffect(function () {
  //   fetch("http://localhost:8000/questions")
  //     .then((res) => res.json())
  //     .then((data) => console.log(data))
  //     .catch((err) => console.error(err.message));
  // }, []);

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
            <Progress />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}
