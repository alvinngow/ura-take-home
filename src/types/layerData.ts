import { ShapeType } from './enums';

export interface Point {
  x: number;
  y: number;
}

export type PenData = {
  points: Point[];
  color: string;
  size: number;
};

export type ShapeData = {
  x: number;
  y: number;
  shape: ShapeType;
  color: string;
};

export type FillData = {
  color: string;
};

export type ImageData = {
  x: number;
  y: number;
  image: HTMLImageElement;
  scale: number;
};
