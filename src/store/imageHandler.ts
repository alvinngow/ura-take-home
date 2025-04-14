import { EditorStore } from '../store/editorStore';
import { ToolType } from '../types/enums';
import { ImageData } from '../types/layerData';
import { ImageLayer } from '../types/layers';

export function drawImageLayer(
  store: EditorStore,
  layerId: string,
  image: HTMLImageElement,
  x: number,
  y: number,
  scale: number
) {
  const ctx = store.ctx;
  if (!ctx) return;

  const width = image.width * scale;
  const height = image.height * scale;
  ctx.drawImage(image, x - width / 2, y - height / 2, width, height);

  if (layerId == store.selectedLayerId) {
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x + width / 2 - 8, y + height / 2 - 8, 16, 16);
  }
}

export function startDraggingImage(store: EditorStore, x: number, y: number) {
  const layer = store.layers.find((l) => l.id === store.selectedLayerId);
  const data = layer?.data as ImageData;
  if (!data) return;

  const img = data.image;
  const imgX = data.x;
  const imgY = data.y;
  const halfW = img.width / 2;
  const halfH = img.height / 2;

  if (
    x >= imgX - halfW &&
    x <= imgX + halfW &&
    y >= imgY - halfH &&
    y <= imgY + halfH
  ) {
    store.dragOffset = { x: x - imgX, y: y - imgY };
  }
}

export function dragImage(store: EditorStore, x: number, y: number) {
  const layer = store.layers.find(
    (l) => l.id === store.selectedLayerId
  ) as ImageLayer;
  if (!layer) return;

  layer.data.x = x - store.dragOffset.x;
  layer.data.y = y - store.dragOffset.y;
  store.redrawCanvas();
}

export function startResizing(
  store: EditorStore,
  x: number,
  y: number
): boolean {
  const layer = store.layers.find((l) => l.id === store.selectedLayerId);
  if (!layer || layer.type !== ToolType.IMAGE) return false;

  const data = layer.data as ImageData;
  const scale = data.scale ?? 1;
  const width = data.image.width * scale;
  const height = data.image.height * scale;

  const handleX = data.x + width / 2;
  const handleY = data.y + height / 2;

  if (
    x >= handleX - 8 &&
    x <= handleX + 8 &&
    y >= handleY - 8 &&
    y <= handleY + 8
  ) {
    store.isResizing = true;
    return true;
  }

  return false;
}

export function resizeImage(store: EditorStore, x: number, y: number) {
  const layer = store.layers.find((l) => l.id === store.selectedLayerId);
  if (!layer || layer.type !== ToolType.IMAGE) return;

  const data = layer.data as ImageData;
  const dx = x - data.x;
  const dy = y - data.y;
  const newScale = Math.max(
    0.1,
    Math.min(3, Math.max(dx / data.image.width, dy / data.image.height))
  );
  data.scale = newScale;
  store.redrawCanvas();
}

export function stopResizing(store: EditorStore) {
  store.isResizing = false;
}

export function isOverImage(store: EditorStore, x: number, y: number): boolean {
  const layer = store.layers.find((l) => l.id === store.selectedLayerId);
  if (!layer || layer.type !== ToolType.IMAGE) return false;

  const data = layer.data as ImageData;
  const scale = data.scale ?? 1;
  const width = data.image.width * scale;
  const height = data.image.height * scale;
  const halfW = width / 2;
  const halfH = height / 2;

  return (
    x >= data.x - halfW &&
    x <= data.x + halfW &&
    y >= data.y - halfH &&
    y <= data.y + halfH
  );
}

export function isOverResizeHandle(
  store: EditorStore,
  x: number,
  y: number
): boolean {
  const layer = store.layers.find((l) => l.id === store.selectedLayerId);
  if (!layer || layer.type !== ToolType.IMAGE) return false;

  const data = layer.data as ImageData;
  const scale = data.scale ?? 1;
  const width = data.image.width * scale;
  const height = data.image.height * scale;
  const handleX = data.x + width / 2;
  const handleY = data.y + height / 2;

  return (
    x >= handleX - 8 && x <= handleX + 8 && y >= handleY - 8 && y <= handleY + 8
  );
}
