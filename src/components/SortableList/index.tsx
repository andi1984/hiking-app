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
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { point2Id } from "../../helpers/helper";
import SortableItem from "./SortableListItem";

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
