export interface Scene {
  objects: RTObject[];
  lights: PointLight[];
  ambientLight: Color;
}

export interface RTObject {
  intersect: (ray: Ray) => Intersection[];
}

export interface Ray {
  origin: Vec;
  direction: Vec;
}

export interface Vec {
  x: number;
  y: number;
  z: number;
}

export interface Intersection {
  distance: number;
  normal: Vec;
  color: Color;
  front: boolean;
}

export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface PointLight {
  position: Vec;
  color: Color;
}
