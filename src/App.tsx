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
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./App.css";

import Map from "./components/Map";
import { useState, useCallback, ReactElement } from "react";

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

function App() {
  const [track, setTrack] = useState<number[][]>([]);

  const onMapClick = useCallback((event: any) => {
    setTrack((prevTrack) => [...prevTrack, event.coordinate]);
  }, []);

  const point2Id = (point: number[]) => point.toString();

  const trackIds = track.map((point) => point2Id(point));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTrack((items) => {
        const oldIndex = items.findIndex(
          (point) => point2Id(point) === active.id
        );
        const newIndex = items.findIndex(
          (point) => point2Id(point) === over?.id
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="App">
      <>
        <aside>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={trackIds}>
              {track.map((value, index) => (
                <SortableItem key={value.toString()} id={value.toString()}>
                  <span>Waypoint {index + 1}</span>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </aside>
        <Map onMapClick={onMapClick} track={track} />
      </>
    </div>
  );
}

export default App;
