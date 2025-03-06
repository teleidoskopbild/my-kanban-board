import { Link } from "react-router-dom";
import { useState } from "react";

function BoardPage() {
  const [board] = useState({
    id: 1,
    columns: ["Backlog", "In Progress", "Review", "Done"],
  });

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Welcome Note",
      description: "Welcome to My-Kanban-Board",
      status: "Backlog",
      boardId: 1,
    },
    {
      id: 2,
      title: "How to use:",
      description: "...some instruction",
      status: "In Progress",
      boardId: 1,
    },
    {
      id: 3,
      title: "Other Infos",
      description: "...some instruction",
      status: "In Progress",
      boardId: 1,
    },
  ]);

  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    status: "Backlog",
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
    const newNoteObj = {
      ...newNote,
      id: notes.length + 1,
      boardId: board.id,
    };
    setNotes((prevNotes) => [...prevNotes, newNoteObj]);
    setNewNote({ title: "", description: "", status: "Backlog" });
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
        <div className="w-1/5"></div>
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
                <div className="border-2 m-2" key={note.id}>
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
