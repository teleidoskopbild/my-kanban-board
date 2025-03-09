import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function BoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);

  const [notes, setNotes] = useState([]);

  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    status: "Backlog",
  });

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
    return <div>Loading...</div>; // Zeigt "Loading..." an, bis das Board geladen ist
  }

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
  };
  return (
    <div>
      <h1>BoardPage</h1>
      <Link to="/">Back to StartPage</Link>
      <div className="flex justify-center mb-4 gap-4">
        <div className="border-2 w-1/5">
          <h2>Add New Note</h2>
          <form onSubmit={handleAddNote}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={newNote.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={newNote.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Status:</label>
              <select
                name="status"
                value={newNote.status}
                onChange={handleInputChange}
              >
                {board.columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">AddNote</button>
          </form>
        </div>
        <div className="w-1/5">
          <button onClick={handleToggleDeleteMode} className=" p-2 border-2">
            {deleteMode ? "Exit Delete Mode" : "Enter Delete Mode"}
          </button>
          <button
            onClick={handleToggleChangeColumnMode}
            className="mt-2 p-2 border-2"
          >
            {changeStatusMode
              ? "Exit Change Status Mode"
              : "Enter Change Status Mode"}
          </button>
        </div>
        <div className="w-1/5"></div>
        <div className="w-1/5"></div>
      </div>

      <div className="flex gap-4 w-full justify-center">
        {board.columns.map((column) => (
          <div className="border-2 w-1/5" key={column}>
            <h2>{column}</h2>
            {notes
              .filter((note) => note.status === column)
              .map((note) => (
                <div className="border-2 m-2 flex flex-col" key={note.id}>
                  {deleteMode && (
                    <button
                      className="self-center m-2 w-1/2 border-2 text-red-500 font-bold"
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
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardPage;
