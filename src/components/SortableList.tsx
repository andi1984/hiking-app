import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactElement } from "react";
import { AiOutlineMenu, AiTwotoneDelete } from "react-icons/ai";

import { point2Id } from "../helper";

const SortableItem = (props: {
  id: string;
  children: ReactElement;
  onDelete: (deleteId: string) => void;
}) => {
  const { id, onDelete } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li className="sortlist__item" ref={setNodeRef} style={style}>
      <button
        type="button"
        aria-label={`Drag menu item ${id}`}
        {...attributes}
        {...listeners}
      >
        <AiOutlineMenu />
      </button>
      <div className="sortlist__item__name">{props.children}</div>
      <button
        type="button"
        aria-label={`Delete menu item ${id}`}
        onClick={() => onDelete(id)}
      >
        <AiTwotoneDelete />
      </button>
    </li>
  );
};

const SortableList: React.FC<{
  track: number[][];
  onDragEnd: (event: DragEndEvent) => void;
  onDelete: (deletedId: string) => void;
}> = ({ track, onDragEnd, onDelete }) => {
  const trackIds = track.map((point) => point2Id(point));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={trackIds}>
        <ol className="sortlist">
          {track.map((point, index) => (
            <SortableItem
              key={point2Id(point)}
              id={point2Id(point)}
              onDelete={(id) => {
                onDelete(id);
              }}
            >
              <span>Waypoint {index + 1}</span>
            </SortableItem>
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;
