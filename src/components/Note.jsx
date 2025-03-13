import { useDraggable } from "@dnd-kit/core";

function Note({
  note,
  board,
  onDelete,
  onChangeStatus,
  deleteMode,
  changeStatusMode,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: note.id,
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className=" self-center rounded-md w-8/9 bg-gray-200 text-gray-700 m-2 p-4 flex flex-col"
      key={note.id}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {deleteMode && (
        <button
          className="self-center p-3 m-2 rounded-lg bg-red-200 text-red-500 font-bold"
          onClick={() => onDelete(note.id)}
        >
          DELETE NOTE
        </button>
      )}
      {changeStatusMode && (
        <select
          className="mb-2 -ml-1 border-1"
          value={note.status}
          onChange={(e) => onChangeStatus(note.id, e.target.value)}
        >
          <option value="" selected>
            Change Status
          </option>
          {board.columns
            .filter((column) => column !== note.status)
            .map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
        </select>
      )}
      <h3 className="font-bold mb-2">{note.title}</h3>
      <p className="break-words">{note.description}</p>
    </div>
  );
}

export default Note;
