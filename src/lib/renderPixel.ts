import { Pixel } from "../common/types";
import { Context } from "./Context";
import { scene } from "./scene";
import { Color, Ray } from "./types";
import { add, c, dot, len, mul, normalize, sub, v } from "./util";

export function renderPixel(context: Context, x: number, y: number): Pixel {
  const ray: Ray = {
    origin: v(0, 0, 0),
    direction: normalize(
      v(context.tanFovX * (x * 2 - 1), 1, -context.tanFovY * (y * 2 - 1))
    ),
  };

  let distance = Infinity;
  let color = c(0, 0, 0);
  for (const object of scene.objects) {
    const intersection = object.intersect(ray)[0];
    if (intersection && intersection.distance < distance) {
      distance = intersection.distance;
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
        let distance = Infinity;
        for (const object of scene.objects) {
          const intersection = object.intersect(ray)[0];
          if (intersection && intersection.distance < distance) {
            distance = intersection.distance;
            if (distance < len(pointToLight)) {
              break;
            }
          }
        }
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
      color = sum;
    }
  }

  return color;
}
