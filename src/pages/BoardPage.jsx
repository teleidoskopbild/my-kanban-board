import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function BoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [activeColumn, setActiveColumn] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [changeStatusMode, setChangeStatusMode] = useState(false);

  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    const boardData = savedBoards.find(
      (board) => board.id === parseInt(boardId)
    );
    if (boardData) {
      setBoard(boardData);
      setNotes(boardData.notes);
    }
  }, [boardId]);

  if (!board) {
    return <div>Loading...</div>;
  }

  const handleAddNoteClick = (column) => {
    setActiveColumn(column);
    setNewNote({ ...newNote, status: column });
  };

  const handleToggleChangeColumnMode = () => {
    setChangeStatusMode((prev) => !prev);
    setDeleteMode(false);
  };

  const handleChangeStatus = (id, status) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, status } : note
    );
    setNotes(updatedNotes);
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    const updatedBoard = savedBoards.map((b) =>
      b.id === board.id ? { ...b, notes: updatedNotes } : b
    );
    localStorage.setItem("boards", JSON.stringify(updatedBoard));
  };

  const handleToggleDeleteMode = () => {
    setDeleteMode((prev) => !prev);
    setChangeStatusMode(false);
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    const updatedBoard = savedBoards.map((b) =>
      b.id === board.id ? { ...b, notes: updatedNotes } : b
    );
    localStorage.setItem("boards", JSON.stringify(updatedBoard));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    const newNoteObj = {
      ...newNote,
      id: notes.length + 1,
      boardId: board.id,
    };
    const updatedNotes = [...notes, newNoteObj];
    setNotes(updatedNotes);
    setNewNote({ title: "", description: "", status: "Backlog" });

    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    const updatedBoard = savedBoards.map((b) =>
      b.id === board.id ? { ...b, notes: updatedNotes } : b
    );
    localStorage.setItem("boards", JSON.stringify(updatedBoard));
    setActiveColumn(null);
  };
  return (
    <div className="flex flex-col bg-gray-200 h-screen w-full overflow-x-auto ">
      <div className="mb-4 p-2 flex bg-gray-300">
        <h1 className="ml-2 mr-10">Your Board: {board.name}</h1>
        <Link to="/"> Go Back</Link>
      </div>

      <div className="ml-2 flex gap-2">
        <button
          onClick={handleToggleDeleteMode}
          className="p-3 rounded-lg bg-gray-300"
        >
          {deleteMode ? "Exit Delete Mode" : "Enter Delete Mode"}
        </button>
        <button
          onClick={handleToggleChangeColumnMode}
          className="p-3 rounded-lg bg-gray-300"
        >
          {changeStatusMode
            ? "Exit Change Status Mode"
            : "Enter Change Status Mode"}
        </button>
      </div>
      <div className="mb-4 mt-auto flex justify-start">
        {board.columns.map((column) => (
          <div
            className="overflow-y-auto flex-shrink-0 m-2 rounded-lg flex flex-col bg-gray-400 w-80 h-[80vh]"
            key={column}
          >
            {activeColumn === column && (
              <div className="sticky top-0 z-10">
                <form
                  onSubmit={handleAddNote}
                  className="bg-gray-300 p-6 w-full max-w-md"
                >
                  <div>
                    <label>Title:</label>
                    <input
                      type="text"
                      name="title"
                      value={newNote.title}
                      onChange={handleInputChange}
                      className="w-full border p-2 my-2"
                    />
                  </div>
                  <div>
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={newNote.description}
                      onChange={handleInputChange}
                      className="w-full border p-2 my-2"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="w-1/3 bg-blue-500 text-white p-2 mt-2"
                    >
                      Add Note
                    </button>
                    <button
                      onClick={() => setActiveColumn(null)}
                      className="w-1/3 ml-4 bg-blue-500 text-white p-2 mt-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-gray-500 text-gray-200 sticky top-0">
              <h2 className="m-2 sticky top-0">{column}</h2>
            </div>

            {notes
              .filter((note) => note.status === column)
              .map((note) => (
                <div
                  className=" self-center rounded-md w-7/8 bg-gray-200 text-gray-700 m-2 p-4 flex flex-col"
                  key={note.id}
                >
                  {deleteMode && (
                    <button
                      className="self-center m-2 rounded-lg bg-red-200 text-red-500 font-bold"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      DELETE NOTE
                    </button>
                  )}
                  {changeStatusMode && (
                    <select
                      value={note.status}
                      onChange={(e) =>
                        handleChangeStatus(note.id, e.target.value)
                      }
                    >
                      {board.columns.map((column) => (
                        <option key={column} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  )}
                  <h3 className="font-bold mb-2">{note.title}</h3>
                  <p className="break-words">{note.description}</p>
                </div>
              ))}

            <div className=" p-3 sticky -bottom-1 bg-gray-500 mt-auto">
              {activeColumn === null && (
                <div
                  onClick={() => handleAddNoteClick(column)}
                  className="sticky bottom-0 rounded-lg p-2 mt-2 bg-gray-300 text-gray-600 hover:text-white cursor-pointer mt-auto"
                >
                  + Add Note
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardPage;
