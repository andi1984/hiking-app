import "./App.css";

import Map from "./components/Map";
import { useState, useCallback } from "react";
import SortableList from "./components/SortableList";

import { point2Id } from "./helpers/helper";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { toLonLat } from "ol/proj";

function App() {
  const [track, setTrack] = useState<number[][]>([]);

  const onMapClick = useCallback((event: any) => {
    setTrack((prevTrack) => [...prevTrack, event.coordinate]);
  }, []);

  const handleDeletion = (deletedId: string) => {
    setTrack((items) => {
      const deletedIdIndex = items.findIndex(
        (point) => point2Id(point) === deletedId
      );

      return [
        ...items.slice(0, deletedIdIndex),
        ...items.slice(deletedIdIndex + 1),
      ];
    });
  };

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
        <aside className="sidebar">
          <h1 className="sidebar__title">Route Builder</h1>
          <SortableList
            track={track}
            onDragEnd={handleDragEnd}
            onDelete={handleDeletion}
          />
          <button
            className="gpx-button"
            disabled={track.length === 0}
            onClick={() => {
              const { buildGPX, BaseBuilder } = require("gpx-builder");

              const { Point } = BaseBuilder.MODELS;

              const points = track.map((point) => {
                const [lon, lat] = toLonLat(point);
                return new Point(lat, lon);
              });

              const gpxData = new BaseBuilder();

              gpxData.setSegmentPoints(points);

              // cf. https://stackoverflow.com/a/24191504/778340
              var filename = "track.gpx";
              var pom = document.createElement("a");
              var bb = new Blob([buildGPX(gpxData.toObject())], {
                type: "text/plain",
              });

              pom.setAttribute("href", window.URL.createObjectURL(bb));
              pom.setAttribute("download", filename);

              pom.dataset.downloadurl = [
                "text/plain",
                pom.download,
                pom.href,
              ].join(":");
              pom.draggable = true;
              pom.classList.add("dragout");

              pom.click();
            }}
          >
            Download your Route
          </button>
        </aside>
        <Map onMapClick={onMapClick} track={track} />
      </>
    </div>
  );
}

export default App;
