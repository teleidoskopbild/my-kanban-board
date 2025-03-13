import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Column from "../components/Column.jsx";
import Note from "../components/Note.jsx";
import { DndContext, DragOverlay } from "@dnd-kit/core";

function BoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [changeStatusMode, setChangeStatusMode] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [activeNote, setActiveNote] = useState(null);

  const handleDragStart = (event) => {
    const { active } = event;
    const note = notes.find((note) => note.id === active.id);
    setActiveNote(note);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveNote(null);
    if (over && active.id !== over.id) {
      const updatedNotes = notes.map((note) =>
        note.id === active.id ? { ...note, status: over.id } : note
      );
      setNotes(updatedNotes);

      const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
      const updatedBoard = savedBoards.map((b) =>
        b.id === board.id ? { ...b, notes: updatedNotes } : b
      );
      localStorage.setItem("boards", JSON.stringify(updatedBoard));
    }
  };

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

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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
        <div className="relative mb-4 mt-auto flex justify-start">
          {board.columns.map((column) => (
            <Column
              key={column}
              column={column}
              activeColumn={activeColumn}
              setActiveColumn={setActiveColumn}
              notes={notes}
              setNotes={setNotes}
              onAddNoteClick={handleAddNoteClick}
              onDeleteNote={handleDeleteNote}
              onChangeStatus={handleChangeStatus}
              deleteMode={deleteMode}
              changeStatusMode={changeStatusMode}
              board={board}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeNote ? <Note note={activeNote} /> : null}{" "}
      </DragOverlay>
    </DndContext>
  );
}

export default BoardPage;
