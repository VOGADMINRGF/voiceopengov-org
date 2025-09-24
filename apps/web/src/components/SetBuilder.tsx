import type { ReactNode } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd";

type Item = { id: string; label: ReactNode };
export default function SetBuilder({ selected, onChange }: { selected: Item[]; onChange: (items: Item[]) => void }) {
  function handleDragEnd(result: DropResult) {
    if (!result?.destination) return;
    const next = [...selected];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    onChange(next);
  }
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="list">
        {(provided: any) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {selected.map((item, idx) => (
              <Draggable key={item.id} draggableId={item.id} index={idx}>
                {(prov: any) => (
                  <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                    {item.label}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
