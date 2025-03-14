import { useDraggable } from "@dnd-kit/core";

function Note({ note }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: note.id,
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className=" self-center w-8/9 bg-gray-200 text-gray-300 m-2 flex flex-col"
      key={note.id}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="">
        {" "}
        <h3 className="bg-blue-700 text-white p-2  font-bold">{note.title}</h3>
        <p className="bg-white text-black p-2 break-words min-h-[4rem]">
          {note.description}
        </p>
      </div>
    </div>
  );
}

export default Note;
