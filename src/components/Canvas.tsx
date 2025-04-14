import { observer } from 'mobx-react-lite';
import React from 'react';
import { EditorStore } from '../store/editorStore';
import { ToolType } from '../types/enums';

interface CanvasProps {
  store: EditorStore;
}

const Canvas: React.FC<CanvasProps> = observer(({ store }) => {
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (store.selectedTool === ToolType.PEN) return; // Ignore clicks for pen tool

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    store.handleCanvasClick(x, y);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (store.selectedTool === ToolType.PEN) {
      store.startDrawing(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    store.continueDrawing(x, y);
  };

  const handleMouseUp = () => {
    store.endDrawing();
  };

  const handleMouseLeave = () => {
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
