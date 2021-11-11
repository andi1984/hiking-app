import { point2Id, route2Features } from "./helper";

describe("point2Id", () => {
  test("Edge-cases", () => {
    //@ts-ignore
    expect(() => point2Id()).toThrow();
    expect(point2Id([0])).toEqual("0");
  });

  test("ID is stringified array representation", () => {
    expect(point2Id([100.2, 200.2])).toBe("100.2,200.2");
  });
});

describe("route2Features", () => {
  test("One marker only just generates a single icon", () => {
    expect(
      route2Features([[0, 0]]).map((feature) => feature.get("type"))
    ).toEqual(["icon"]);
  });

  test("Two markers generate two icons combined by a route", () => {
    expect(
      route2Features([
        [0, 0],
        [22, 22],
      ]).map((feature) => feature.get("type"))
    ).toEqual(["icon", "icon", "route"]);
  });

  test("Icons contain a custom label prop", () => {
    const allIcons = route2Features([
      [0, 0],
      [22, 22],
    ]).filter((feature) => feature.get("type") === "icon");

    expect(allIcons.map((icon) => icon.get("label"))).toHaveLength(2);
  });
});
