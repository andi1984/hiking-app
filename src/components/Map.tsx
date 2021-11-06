import { FC, useRef, useEffect, useState } from "react";
import OpenLayersMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import { Map as MapType } from "ol";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

const vectorLayerStyle = {
  icon: new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({
        color: "white",
        width: 2,
      }),
    }),
  }),
};
const Map: FC<{}> = () => {
  const mapDOMElement = useRef(null);
  let [olMap, setOlMap] = useState<MapType>();
  let [vectorSource, setVectorSource] = useState<VectorSource<Geometry>>();
  useEffect(() => {
    if (!!mapDOMElement.current) {
      setVectorSource(new VectorSource({ wrapX: false, features: [] }));
      setOlMap(
        new OpenLayersMap({
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
        })
      );
    }
  }, []);

  useEffect(() => {
    if (!!olMap) {
      olMap.addLayer(
        new VectorLayer({
          source: vectorSource,
          style: function (feature) {
            const featureType: keyof typeof vectorLayerStyle = feature.get(
              "type"
            );
            return vectorLayerStyle[featureType];
          },
        })
      );

      olMap.on("singleclick", function (event) {
        const coordinate = event.coordinate;
        console.log({ coordinate, vectorSource });
        // trying hard to add a marker to the map
        if (!!vectorSource) {
          console.log("adding new icon feature");
          vectorSource.addFeature(
            new Feature({ type: "icon", geometry: new Point(event.coordinate) })
          );
          console.log(vectorSource.getFeatures());
        }
      });
    }
  }, [olMap]);

  return <div ref={mapDOMElement} className="map" />;
};
export default Map;
