import logo from "./logo.svg";
import "./App.css";

import Map from "./components/Map";
import { useState, useCallback } from "react";

function App() {
  const [track, setTrack] = useState<number[][]>([]);

  const onMapClick = useCallback((event: any) => {
    setTrack((prevTrack) => [...prevTrack, event.coordinate]);
  }, []);

  return (
    <div className="App">
      <>
        <aside>Foo</aside>
        <Map onMapClick={onMapClick} track={track} />
      </>
    </div>
  );
}

export default App;
