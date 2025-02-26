import { Pixel } from "../common/types";
import { Context } from "./Context";
import { scene } from "./scene";
import { Color, Intersection, Ray, RTObject } from "./types";
import { add, c, dot, len, mul, normalize, sub, v } from "./util";

function intersect(ray: Ray): [Intersection, RTObject] | undefined {
  let result: [Intersection, RTObject] | undefined;

  for (const object of scene.objects) {
    const intersection = object.intersect(ray);
    if (
      intersection.length &&
      (!result || intersection[0].distance < result[0].distance)
    ) {
      result = [intersection[0], object];
    }
  }

  return result;
}

export function renderPixel(context: Context, x: number, y: number): Pixel {
  const ray: Ray = {
    origin: v(0, 0, 0),
    direction: normalize(
      v(context.tanFovX * (x * 2 - 1), 1, -context.tanFovY * (y * 2 - 1))
    ),
  };

  const hit = intersect(ray);
  if (!hit) {
    return c(0, 0, 0);
  }
  const [intersection, object] = hit;
  let sum: Color = {
    r: scene.ambientLight.r * intersection.color.r,
    g: scene.ambientLight.g * intersection.color.g,
    b: scene.ambientLight.b * intersection.color.b,
  };
  const point = add(
    add(ray.origin, mul(ray.direction, intersection.distance)),
    mul(intersection.normal, 0.0001)
  );
  for (const light of scene.lights) {
    const pointToLight = sub(light.position, point);
    const ray: Ray = { origin: point, direction: normalize(pointToLight) };
    const distance = intersect(ray)?.[0].distance ?? Infinity;
    if (distance > len(pointToLight)) {
      const factor = Math.max(
        0,
        dot(intersection.normal, normalize(pointToLight))
      );
      sum = {
        r: sum.r + light.color.r * intersection.color.r * factor,
        g: sum.g + light.color.g * intersection.color.g * factor,
        b: sum.b + light.color.b * intersection.color.b * factor,
      };
    }
  }
  return sum;
}
