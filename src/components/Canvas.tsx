import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { EditorStore } from '../store/editorStore';
import { ToolType } from '../types/enums';
import {
  dragImage,
  isOverImage,
  isOverResizeHandle,
  resizeImage,
  startDraggingImage,
  startResizing,
  stopResizing,
} from '../store/imageHandler';

interface CanvasProps {
  store: EditorStore;
}

const Canvas: React.FC<CanvasProps> = observer(({ store }) => {
  const [isDragging, setIsDragging] = useState(false);

  const getCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (
      store.selectedTool === ToolType.PEN ||
      store.selectedTool === ToolType.IMAGE
    )
      return;
    const { x, y } = getCoords(e);
    store.handleCanvasClick(x, y);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoords(e);

    if (store.selectedTool === ToolType.PEN) {
      store.startDrawing(x, y);
    }

    if (store.selectedTool === ToolType.IMAGE && store.selectedLayerId) {
      const isResizing = startResizing(store, x, y);
      if (isResizing) {
        setIsDragging(true);
        return;
      }

      const selectedLayer = store.layers.find(
        (l) => l.id === store.selectedLayerId
      );
      if (selectedLayer?.type === ToolType.IMAGE) {
        startDraggingImage(store, x, y);
        setIsDragging(true);
      }
    }

    // Only trigger click for SHAPE or FILL
    if (
      store.selectedTool === ToolType.SHAPE ||
      store.selectedTool === ToolType.FILL
    ) {
      store.handleCanvasClick(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoords(e);
    const canvas = e.currentTarget;
    if (isDragging) {
      if (store.isResizing) {
        resizeImage(store, x, y);
        canvas.style.cursor = 'nwse-resize';
      } else {
        dragImage(store, x, y);
        canvas.style.cursor = 'grabbing';
      }

      return;
    }
    const isOverHandle = isOverResizeHandle(store, x, y);
    if (isOverHandle) {
      canvas.style.cursor = 'nwse-resize';
      return;
    }

    const isMouseOverImage = isOverImage(store, x, y);
    if (isMouseOverImage) {
      canvas.style.cursor = 'grab';
      return;
    }

    canvas.style.cursor = 'default';

    store.continueDrawing(x, y);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      stopResizing(store);
    }
    store.endDrawing();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      stopResizing(store);
    }
    store.endDrawing();
  };

  return (
    <canvas
      id='main-canvas'
      className='w-full h-full block'
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
});

export default Canvas;
