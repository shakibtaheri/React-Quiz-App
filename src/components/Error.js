function Error({ children }) {
  return (
    <div className="error">
      <span>💥</span> There was an error fecthing questions.
      <p>{children}</p>
    </div>
  );
}

export default Error;
