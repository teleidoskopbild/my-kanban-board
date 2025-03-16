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
      notes: [
        {
          id: 1,
          title: "Welcome Note",
          description:
            "Hello, drag and drop me to other columns!! Or delete me!",
          status: "Backlog",
        },
      ],
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
    <div className="flex flex-col items-center bg-white text-gray-900 w-full h-screen p-4 justify-center">
      <h1 className="text-3xl font-bold mt-4">MY KANBAN BOARD</h1>
      <p className="text-lg mt-2">
        Organize your tasks efficiently with personalized boards.
      </p>
      <div className="mt-6 w-full max-w-md bg-blue-500 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl text-center font-semibold">
          YOUR EXISTING BOARDS
        </h2>
        <p className="text-sm mt-1 text-center">
          Here are your current boards. Click a name to open it.
        </p>
        {boards.length === 0 && (
          <p className="text-sm text-gray-700 mt-2 text-center">
            You haven't created any boards yet. Start your first board now!
          </p>
        )}
        <ul className="mt-4 space-y-2">
          {boards.map((board) => (
            <li
              key={board.id}
              className="flex justify-between items-center bg-gray-300 p-2 rounded"
            >
              <Link
                to={`/board/${board.id}`}
                className="text-blue-600 hover:underline"
              >
                {board.name}
              </Link>
              <button
                onClick={() => handleDeleteBoard(board.id)}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 w-full max-w-md bg-blue-500 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center">Create New Board</h2>
        <p className="text-sm mt-1 text-center">
          Enter a name and create a new board for your tasks.
        </p>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={handleCreateBoard}
            className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-700 mt-6">
        All data is stored locally. Your boards will be available next time you
        open the app.
      </p>{" "}
    </div>
  );
}

export default StartPage;
