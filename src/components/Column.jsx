import { useState } from "react";
import Note from "./Note";
import { useDroppable } from "@dnd-kit/core";

function Column({
  column,
  notes,
  setNotes,
  activeColumn,
  setActiveColumn,
  onDeleteNote,

  deleteMode,

  board,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column,
  });
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    status: column,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNote = (e) => {
    e.preventDefault();

    const randomString = Math.random().toString(36).substring(2, 6);

    const newNoteObj = {
      ...newNote,
      id: `${notes.length + 1}-${randomString}`,
      boardId: board.id,
    };
    const updatedNotes = [...notes, newNoteObj];
    setNotes(updatedNotes);
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    const updatedBoard = savedBoards.map((b) =>
      b.id === board.id ? { ...b, notes: updatedNotes } : b
    );
    localStorage.setItem("boards", JSON.stringify(updatedBoard));
    setActiveColumn(null);
  };

  return (
    <div
      ref={setNodeRef}
      className="relative scrollCol overflow-y-auto flex-shrink-0 m-3  flex flex-col bg-gray-100 w-80 h-[80vh] border-1"
      key={column}
      style={{ borderColor: isOver ? "#0000ff" : "black" }}
    >
      {activeColumn === column && (
        <div className="sticky w-80 top-0 z-10">
          <form
            onSubmit={handleAddNote}
            className="flex flex-col justify-end bg-white p-6 w-full"
          >
            <div>
              <label>Title:</label>
              <input
                autoFocus
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
                onClick={() => {
                  setActiveColumn(null);
                  setNewNote({
                    title: "",
                    description: "",
                    status: column,
                  });
                }}
                className="w-1/3 ml-4 bg-blue-500 text-white p-2 mt-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="text-center p-2 bg-blue-500 text-gray-200 sticky top-0">
        <h2 className="p-2 sticky top-0">
          <span className="ml-2 font-bold">{column} </span>{" "}
          <span className="bg-blue-600 ml-2 px-2 py-1 rounded-lg">
            {notes.filter((note) => note.status === column).length}
          </span>
        </h2>
      </div>

      {notes
        .filter((note) => note.status === column)
        .map((note) => (
          <Note
            key={note.id}
            note={note}
            onDelete={onDeleteNote}
            deleteMode={deleteMode}
            board={board}
          />
        ))}

      <div className=" p-3 sticky -bottom-1 bg-blue-500 mt-auto">
        {activeColumn === null && (
          <div
            onClick={() => setActiveColumn(column)}
            className="sticky bottom-0 rounded-lg p-2 mt-2 bg-white text-gray-600 hover:text-black cursor-pointer mt-auto"
          >
            + Add Note
          </div>
        )}
      </div>
    </div>
  );
}

export default Column;
