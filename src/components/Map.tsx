import { FC, useRef, useEffect, useState, useMemo } from "react";
import OpenLayersMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";
import Geometry from "ol/geom/Geometry";

import { MapBrowserEvent, Feature } from "ol";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";

import { route2Features } from "../helpers/helper";

/**
 * Find out:
 * - save markers in React state
 * - update the map whenever the markers in the React state are changing
 * - Redraw the lines between the markers (in order!) whenever they change
 * - Idea is having two different vector layers. One for the POI markers and one for the drawing line between them
 **/
const vectorLayerStyle = (feature: Feature<Geometry>) => {
  const featureType = feature.get("type") as keyof typeof vectorLayerStyle;

  switch (featureType) {
    case "route":
      return new Style({
        stroke: new Stroke({
          width: 6,
          color: [75, 134, 232, 1],
        }),
      });
    case "icon":
      return new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: "black" }),
        }),
        text: new Text({
          text: feature.get("label"),
          fill: new Fill({ color: "white" }),
        }),
      });
    default:
      return new Style({});
  }
};

const Map: FC<{
  track: number[][];
  onMapClick: (event: MapBrowserEvent<UIEvent>) => void;
}> = ({ track, onMapClick }) => {
  const mapDOMElement = useRef(null);
  const olMap = useRef<OpenLayersMap | null>(null);

  type VectorSourceType = VectorSource<Geometry>;
  let [vectorLayer, setVectorLayer] = useState<VectorLayer<VectorSourceType>>();

  // ON MOUNT
  useEffect(() => {
    if (!!mapDOMElement.current) {
      olMap.current = new OpenLayersMap({
        target: mapDOMElement.current,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            }),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });

      const vectorLayer = new VectorLayer({
        source: new VectorSource({ wrapX: false, features: [] }),
        style: function () {
          return vectorLayerStyle.apply(
            null,
            arguments as unknown as [Feature<Geometry>]
          );
        },
      });

      olMap.current.addLayer(vectorLayer);

      // Save vectorlayer for later
      setVectorLayer(vectorLayer);
    }
  }, []);

  // onMapClick callback changes
  useEffect(() => {
    // Unlisten potentially old listener
    olMap.current?.un("singleclick", onMapClick);

    // Listen new listener
    olMap.current?.on("singleclick", onMapClick);
  }, [onMapClick]);

  // ON ROUTE CHANGE
  const memoizedFeatures = useMemo(() => route2Features(track), [track]);
  useEffect(() => {
    vectorLayer?.setSource(
      new VectorSource({
        wrapX: false,
        features: memoizedFeatures,
      })
    );
  }, [vectorLayer, memoizedFeatures]);

  return <div ref={mapDOMElement} className="map" />;
};
export default Map;
