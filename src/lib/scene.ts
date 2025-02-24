import { CSGDifference } from "./CSGDifference";
import { CSGIntersection } from "./CSGIntersection";
import { Plane } from "./Plane";
import { Sphere } from "./Sphere";
import { Scene } from "./types";
import { c, v } from "./util";

export const scene: Scene = {
  objects: [
    new Plane(v(0, 0, -5), v(0, 0, 1), c(1, 1, 1)),
    new CSGIntersection(
      new CSGDifference(
        new Sphere(v(-4, 10, 0), 2, c(1, 0, 0)),
        new Sphere(v(-2, 10, 0), 2, c(0, 1, 0))
      ),
      new Plane(v(0, 8.5, 0), v(0, -1, 0), c(0, 0, 1))
    ),
    new Sphere(v(4, 10, 0), 2, c(0.5, 0.5, 0.5)),
  ],
  lights: [{ position: v(0, 10, 10), color: c(0.5, 0.5, 0.5) }],
  ambientLight: c(0.4, 0.4, 0.4),
};
