import { Link } from "react-router-dom";

function StartPage() {
  return (
    <div>
      <h1>Start Page</h1>
      <Link to="/board">To Board Page</Link>
    </div>
  );
}

export default StartPage;
