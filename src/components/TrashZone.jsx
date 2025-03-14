import { useDroppable } from "@dnd-kit/core";

function TrashZone() {
  const { setNodeRef } = useDroppable({
    id: "trash-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 m-3 flex flex-col items-center justify-center bg-gray-100 w-80 h-[20vh] border-1"
    >
      <h1 className="text-center">Trash Zone</h1>
      <p className="text-center">Drag and Drop Elements here to Delete them</p>
      <img className="w-10 h-10" src="trash.svg" alt="Trash" />
    </div>
  );
}

export default TrashZone;
