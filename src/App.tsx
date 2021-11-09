import "./App.css";

import Map from "./components/Map";
import { useState, useCallback } from "react";
import SortableList from "./components/SortableList";

import { point2Id } from "./helper";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

function App() {
  const [track, setTrack] = useState<number[][]>([]);

  const onMapClick = useCallback((event: any) => {
    setTrack((prevTrack) => [...prevTrack, event.coordinate]);
  }, []);

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
          <SortableList track={track} onDragEnd={handleDragEnd} />
        </aside>
        <Map onMapClick={onMapClick} track={track} />
      </>
    </div>
  );
}

export default App;
