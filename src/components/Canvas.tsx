import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { EditorStore } from '../store/editorStore';
import { ToolType } from '../types/enums';

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
      // Try resizing first
      const isResizing = store.startResizing(x, y);
      if (isResizing) {
        setIsDragging(true);
        return;
      }

      // Else, try dragging
      const selectedLayer = store.layers.find(
        (l) => l.id === store.selectedLayerId
      );
      if (selectedLayer?.type === ToolType.IMAGE) {
        store.startDraggingImage(x, y);
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

    if (isDragging) {
      if (store.isResizing) {
        store.resizeImage(x, y);
      } else {
        store.dragImage(x, y);
      }
    }

    store.continueDrawing(x, y);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      store.stopResizing();
    }
    store.endDrawing();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      store.stopResizing();
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
