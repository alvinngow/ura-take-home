import { ToolType } from './enums';
import { FillData, ImageData, PenData, ShapeData } from './layerData';

export interface BaseLayer {
  id: string;
  name: string;
  type: ToolType;
  visible: boolean;
}

export interface ShapeLayer extends BaseLayer {
  data: ShapeData;
}

export interface FillLayer extends BaseLayer {
  data: FillData;
}

export interface BrushLayer extends BaseLayer {
  data: PenData;
}

export interface ImageLayer extends BaseLayer {
  data: ImageData;
}

// The union type
export type Layer = ShapeLayer | FillLayer | BrushLayer | ImageLayer;
