import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Column from "../components/Column.jsx";
import Note from "../components/Note.jsx";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import TrashZone from "../components/TrashZone.jsx";

function BoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [activeNote, setActiveNote] = useState(null);
  const [filterNotes, setFilterNotes] = useState("");

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(filterNotes.toLowerCase())
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const note = notes.find((note) => note.id === active.id);
    setActiveNote(note);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveNote(null);
    if (over && over.id === "trash-zone") {
      const updatedNotes = notes.filter((note) => note.id !== active.id);
      setNotes(updatedNotes);

      const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
      const updatedBoard = savedBoards.map((b) =>
        b.id === board.id ? { ...b, notes: updatedNotes } : b
      );
      localStorage.setItem("boards", JSON.stringify(updatedBoard));
    } else if (over && active.id !== over.id) {
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

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex flex-col bg-white h-screen w-full overflow-x-auto ">
        <div className="mb-4 p-2 flex bg-blue-300">
          <h1 className="ml-2 mr-10">Your Board: {board.name}</h1>
          <Link to="/"> Go Back</Link>
        </div>
        <div className="mb-4 p-2">
          <input
            type="text"
            placeholder="Search Notes..."
            value={filterNotes}
            onChange={(e) => setFilterNotes(e.target.value)}
            className="p-2 border rounded mb-4"
          />
        </div>

        <div className="relative mb-4  flex justify-start">
          {board.columns.map((column) => (
            <Column
              key={column}
              column={column}
              activeColumn={activeColumn}
              setActiveColumn={setActiveColumn}
              notes={filteredNotes}
              setNotes={setNotes}
              onAddNoteClick={handleAddNoteClick}
              board={board}
            />
          ))}
          <TrashZone />
        </div>
      </div>
      <DragOverlay>
        {activeNote ? <Note note={activeNote} /> : null}{" "}
      </DragOverlay>
    </DndContext>
  );
}

export default BoardPage;
