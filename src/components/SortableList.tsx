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

import { point2Id } from "../helper";

const SortableItem = (props: { id: string; children: ReactElement }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </li>
  );
};

const SortableList: React.FC<{
  track: number[][];
  onDragEnd: (event: DragEndEvent) => void;
}> = ({ track, onDragEnd }) => {
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
        <ol>
          {track.map((point, index) => (
            <SortableItem key={point2Id(point)} id={point2Id(point)}>
              <span>Waypoint {index + 1}</span>
            </SortableItem>
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;
