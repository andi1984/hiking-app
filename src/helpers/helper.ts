import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";

import memoize from "lodash.memoize";

const _point2Features = (
  point: number[],
  label: string,
  previousPoint?: number[]
) => {
  let addedFeatures = [];

  // ADD POINT MARKER
  addedFeatures.push(
    new Feature({ type: "icon", geometry: new Point(point), label })
  );

  // ADD LINE TO PREVIOUS MARKER
  if (!!previousPoint) {
    addedFeatures.push(
      new Feature({
        type: "route",
        geometry: new LineString([previousPoint, point]),
      })
    );
  }

  return addedFeatures.flat();
};

const point2Features = memoize(
  _point2Features,
  (point, label, prevPoint) =>
    `${point?.toString()}-${label}-${prevPoint?.toString()}}`
);

const _route2Features = (route: number[][]): Feature<Geometry>[] => {
  if (route.length === 0) {
    return [];
  }

  // Copy route
  const oldRoute = [...route];
  const newestPoint = oldRoute.pop();

  if (!newestPoint) {
    return [];
  }

  const label = (
    (oldRoute.length > 0
      ? route.findIndex((point) => point === oldRoute[oldRoute.length - 1]) + 1
      : 0) + 1
  ).toString();

  return [
    ...route2Features(oldRoute),
    ...(oldRoute.length > 0
      ? point2Features(newestPoint, label, oldRoute[oldRoute.length - 1])
      : point2Features(newestPoint, label)),
  ];
};

export const route2Features = memoize(_route2Features);

export const point2Id = (point: number[]) => point.toString();
