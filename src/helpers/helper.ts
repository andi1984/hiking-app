import memoize from "lodash.memoize";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";

/**
 * Helper method to generate OpenLayer map features for every point/marker the
 * user adds.
 */
const _point2Features = (
  point: number[],
  label: string,
  previousPoint?: number[]
) => {
  let addedFeatures = [];

  // We always add the actual marker for the new point added
  addedFeatures.push(
    new Feature({ type: "icon", geometry: new Point(point), label })
  );

  // If there is a previous point, we need to add the necessary line/connection
  // between those two.
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

/**
 * Recursively working helper method to generate a list of geometrical features
 * based on a given route (list of points).
 */
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

/**
 * Generates a unique ID for a given point
 */
export const point2Id = (point: number[]) => point.toString();
