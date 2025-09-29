function FinishScreen({ points, maxPoints, highscore, dispatch }) {
  const percentage = (points / maxPoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🎖️";
  return (
    <>
      <p className="result">
        Your scored
        <strong> {points}</strong> out of {maxPoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(HighestScore: {highscore})</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restarts
      </button>
    </>
  );
}

export default FinishScreen;
