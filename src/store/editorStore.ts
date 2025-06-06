import { makeAutoObservable } from 'mobx';
import { ShapeType, ToolType } from '../types/enums';
import {
  FillData,
  ImageData,
  PenData,
  Point,
  ShapeData,
} from '../types/layerData';
import { Layer } from '../types/layers';
import { drawImageLayer } from './imageHandler';

export class EditorStore {
  selectedTool: ToolType = ToolType.NONE;
  selectedColor: string = '#1E90FF'; // Default to blue
  selectedShape: ShapeType = ShapeType.CIRCLE;
  selectedLayerId: string | null = null;
  penSize: number = 3; // Default pen size
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  layers: Layer[] = [];

  // For pen tool
  isDrawing: boolean = false;
  isResizing: boolean = false;
  currentPoints: Point[] = [];
  uploadedImage: HTMLImageElement | null = null;
  dragOffset: { x: number; y: number } = { x: 0, y: 0 };
  layerHistory: Layer[][] = [];
  constructor() {
    makeAutoObservable(this);
  }

  resizeCanvas = () => {
    if (this.canvas) {
      const container = this.canvas.parentElement;
      if (container) {
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.redrawCanvas();
      }
    }
  };
  initializeCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    window.addEventListener('resize', this.resizeCanvas);
    this.resizeCanvas();
  }

  destroyCanvas() {
    if (!this.canvas) return;

    // Optional: remove resize event listener
    window.removeEventListener('resize', this.resizeCanvas);

    // Clear references
    this.ctx = null;
    this.canvas = null;
  }

  setSelectedTool(tool: ToolType) {
    this.selectedTool = tool;
  }

  setSelectedColor(color: string) {
    this.selectedColor = color;
  }

  setSelectedShape(shape: ShapeType) {
    this.selectedShape = shape;
  }

  setPenSize(size: number) {
    this.penSize = size;
  }
  setUploadedImage(file: File) {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = () => {
      this.uploadedImage = img;
      const canvasWidth = this.canvas?.width ?? 0;
      const canvasHeight = this.canvas?.height ?? 0;

      const data: ImageData = {
        image: img,
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        scale: 1,
      };

      this.addLayer(ToolType.IMAGE, data);
    };
  }

  addLayer(type: ToolType, data: PenData | ShapeData | FillData | ImageData) {
    this.pushHistory();

    const layerId = `layer-${this.layers.length + 1}`;
    const newLayer = {
      id: layerId,
      name: `Layer ${this.layers.length + 1}`,
      type,
      visible: true,
      data,
    };

    this.layers.push(newLayer as Layer);
    if (type === ToolType.IMAGE) {
      this.selectedLayerId = layerId;
    }

    this.redrawCanvas();

    return newLayer;
  }

  deleteLayer(layerId: string) {
    this.pushHistory();
    const layer = this.layers.find((l) => l.id === layerId);
    if (layer) {
      this.layers = this.layers.filter((layer) => layer.id !== layerId);
      this.redrawCanvas();
    }
  }

  toggleLayerVisibility(layerId: string) {
    const layer = this.layers.find((l) => l.id === layerId);
    if (layer) {
      layer.visible = !layer.visible;
      this.redrawCanvas();
    }
  }

  redrawCanvas() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.layers.forEach((layer) => {
      if (!layer.visible) return;

      if (layer.type === ToolType.FILL) {
        const data = layer.data as FillData;

        this.drawFill(data.color);
      } else if (layer.type === ToolType.SHAPE) {
        const data = layer.data as ShapeData;
        this.drawShape(data.x, data.y, data.shape, data.color);
      } else if (layer.type === ToolType.PEN) {
        const data = layer.data as PenData;

        this.drawPath(data.points, data.color, data.size);
      } else if (layer.type === ToolType.IMAGE) {
        const data = layer.data as ImageData;
        drawImageLayer(this, layer.id, data.image, data.x, data.y, data.scale);
      }
    });

    if (this.isDrawing && this.currentPoints.length > 0) {
      this.drawPath(this.currentPoints, this.selectedColor, this.penSize);
    }
  }

  drawFill(color: string) {
    if (!this.ctx || !this.canvas) return;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawShape(x: number, y: number, shape: ShapeType, color: string) {
    if (!this.ctx) return;

    this.ctx.fillStyle = color;

    switch (shape) {
      case ShapeType.CIRCLE:
        this.ctx.beginPath();
        this.ctx.arc(x, y, 50, 0, Math.PI * 2);
        this.ctx.fill();
        break;

      case ShapeType.RECTANGLE:
        this.ctx.fillRect(x - 50, y - 50, 100, 100);
        break;

      case ShapeType.TRIANGLE:
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 50);
        this.ctx.lineTo(x + 50, y + 50);
        this.ctx.lineTo(x - 50, y + 50);
        this.ctx.closePath();
        this.ctx.fill();
        break;
    }
  }

  drawPath(points: Point[], color: string, size: number) {
    if (!this.ctx || points.length < 2) return;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = size;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.stroke();
  }

  handleCanvasClick(x: number, y: number) {
    if (this.selectedTool === ToolType.SHAPE) {
      this.addLayer(ToolType.SHAPE, {
        x,
        y,
        shape: this.selectedShape,
        color: this.selectedColor,
      });
    } else if (this.selectedTool === ToolType.FILL) {
      this.addLayer(ToolType.FILL, {
        color: this.selectedColor,
      });
    }
  }

  startDrawing(x: number, y: number) {
    if (this.selectedTool !== ToolType.PEN) return;

    this.isDrawing = true;
    this.currentPoints = [{ x, y }];
    this.redrawCanvas();
  }

  continueDrawing(x: number, y: number) {
    if (!this.isDrawing || this.selectedTool !== ToolType.PEN) return;

    this.currentPoints.push({ x, y });
    this.redrawCanvas();
  }

  endDrawing() {
    if (!this.isDrawing || this.selectedTool !== ToolType.PEN) return;

    if (this.currentPoints.length > 1) {
      this.addLayer(ToolType.PEN, {
        points: [...this.currentPoints],
        color: this.selectedColor,
        size: this.penSize,
      });
    }

    this.isDrawing = false;
    this.currentPoints = [];
  }

  saveCanvasAsImage() {
    if (!this.canvas) return;

    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }

  selectLayer(layerId: string) {
    if (this.selectedLayerId == layerId) {
      this.selectedLayerId = null;

      this.redrawCanvas();
    } else {
      this.selectedLayerId = layerId;
    }
  }

  pushHistory() {
    const snapshot = this.layers.map((layer) => ({
      ...layer,
      data: JSON.parse(JSON.stringify(layer.data)),
    }));
    this.layerHistory.push(snapshot);
  }

  undo() {
    if (this.layerHistory.length === 0) return;

    const prevLayers = this.layerHistory.pop();
    if (prevLayers) {
      this.layers = prevLayers;
      this.redrawCanvas();
    }
  }
}
