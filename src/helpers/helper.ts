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
 * based on a given reversed route (list of points).
 */

export const route2Features = memoize((reverseRoute: number[][], index: number = 0): Feature<Geometry>[] => {
  if (reverseRoute.length === 0) {
    return [];
  }

  // Copy route
  const oldRoute = [...reverseRoute];
  const newestPoint = oldRoute.pop();

  if (!newestPoint) {
    return [];
  }

  const label = (index + 1).toString();

  return [
    ...route2Features(oldRoute, index+1),
    ...(oldRoute.length > 0
      ? point2Features(newestPoint, label, oldRoute[oldRoute.length - 1])
      : point2Features(newestPoint, label)),
  ];
});


/**
* Helper method to generate OpenLayer map features for every point/marker for a given route.
* Note: Be aware that route2Features expects a reversed route.
*/
export const generateMapFeatures = (route: number[][]) => {
  return route2Features([...route].reverse());
};


/**
 * Generates a unique ID for a given point
 */
export const point2Id = (point: number[]) => point.toString();
