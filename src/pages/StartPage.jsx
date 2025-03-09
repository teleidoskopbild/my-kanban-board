import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function StartPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    setBoards(savedBoards);
  }, []);

  const handleCreateBoard = () => {
    const newBoard = {
      id: boards.length + 1,
      name: newBoardName,
      columns: ["Backlog", "In Progress", "Review", "Done"],
      notes: [],
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    localStorage.setItem("boards", JSON.stringify(updatedBoards));
    setNewBoardName("");
  };
  const handleDeleteBoard = (id) => {
    const updatedBoards = boards.filter((board) => board.id !== id);
    setBoards(updatedBoards);
    localStorage.setItem("boards", JSON.stringify(updatedBoards));
  };
  return (
    <div>
      <h1>Start Page</h1>
      <div>
        <h2>Your Boards</h2>
        <ul>
          {boards.map((board) => (
            <li key={board.id}>
              <Link to={`/board/${board.id}`}>{board.name}</Link>
              <button onClick={() => handleDeleteBoard(board.id)}>
                Delete Board
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Create New Board</h2>
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
        ></input>
        <button onClick={handleCreateBoard}>Create Board</button>
      </div>
    </div>
  );
}

export default StartPage;
