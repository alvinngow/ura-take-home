import React from 'react';
import { observer } from 'mobx-react-lite';
import { EditorStore } from '../store/editorStore';
import { ShapeType, ToolType } from '../types/enums';
interface ControlPanelProps {
  store: EditorStore;
}

const ControlPanel: React.FC<ControlPanelProps> = observer(({ store }) => {
  const colorOptions = ['#1E90FF', '#FF6347', '#32CD32', '#FFD700', '#FF69B4'];
  const penSizes = [1, 3, 5, 8, 12];

  if (store.selectedTool === ToolType.NONE) {
    return (
      <div className='p-4'>
        <p className='text-gray-500 text-center'>
          Select a tool to see options
        </p>
      </div>
    );
  }

  return (
    <div className='p-4'>
      {store.selectedTool !== ToolType.IMAGE && (
        <div>
          <h3 className='text-lg font-semibold pb-3 mb-4 border-b border-gray-300'>
            {store.selectedTool === ToolType.SHAPE
              ? 'Shape Tool'
              : store.selectedTool === ToolType.FILL
              ? 'Fill Tool'
              : 'Pen Tool'}
          </h3>
          <div className='mb-6'>
            <h4 className='text-sm font-medium mb-2'>Color</h4>
            <div className='flex flex-wrap gap-2'>
              {colorOptions.map((color) => (
                <div
                  key={color}
                  className={`w-8 h-8 rounded-full cursor-pointer ${
                    store.selectedColor === color ? 'ring-2 ring-gray-700' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => store.setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {store.selectedTool === ToolType.SHAPE && (
        <div>
          <h4 className='text-sm font-medium mb-2'>Shape</h4>
          <div className='flex gap-2'>
            <button
              className={`w-10 h-10 flex items-center justify-center ${
                store.selectedShape === ShapeType.CIRCLE
                  ? 'bg-gray-200 border-2 border-gray-700'
                  : 'bg-white border border-gray-300'
              } rounded`}
              onClick={() => store.setSelectedShape(ShapeType.CIRCLE)}
            >
              <svg viewBox='0 0 24 24' className='w-6 h-6 text-gray-700'>
                <circle cx='12' cy='12' r='8' fill='currentColor' />
              </svg>
            </button>

            <button
              className={`w-10 h-10 flex items-center justify-center ${
                store.selectedShape === ShapeType.RECTANGLE
                  ? 'bg-gray-200 border-2 border-gray-700'
                  : 'bg-white border border-gray-300'
              } rounded`}
              onClick={() => store.setSelectedShape(ShapeType.RECTANGLE)}
            >
              <svg viewBox='0 0 24 24' className='w-6 h-6 text-gray-700'>
                <rect x='4' y='4' width='16' height='16' fill='currentColor' />
              </svg>
            </button>

            <button
              className={`w-10 h-10 flex items-center justify-center ${
                store.selectedShape === ShapeType.TRIANGLE
                  ? 'bg-gray-200 border-2 border-gray-700'
                  : 'bg-white border border-gray-300'
              } rounded`}
              onClick={() => store.setSelectedShape(ShapeType.TRIANGLE)}
            >
              <svg viewBox='0 0 24 24' className='w-6 h-6 text-gray-700'>
                <polygon points='12,4 20,20 4,20' fill='currentColor' />
              </svg>
            </button>
          </div>
        </div>
      )}

      {store.selectedTool === ToolType.PEN && (
        <div>
          <h4 className='text-sm font-medium mb-2'>Pen Size</h4>
          <div className='flex gap-2'>
            {penSizes.map((size) => (
              <button
                key={size}
                className={`w-10 h-10 flex items-center justify-center ${
                  store.penSize === size
                    ? 'bg-gray-200 border-2 border-gray-700'
                    : 'bg-white border border-gray-300'
                } rounded`}
                onClick={() => store.setPenSize(size)}
              >
                <div
                  className='rounded-full bg-gray-700'
                  style={{
                    width: `${Math.min(size * 2, 24)}px`,
                    height: `${Math.min(size * 2, 24)}px`,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      {store.selectedTool === ToolType.IMAGE && (
        <div className='option-section'>
          <h4 className='text-lg font-semibold pb-3 mb-4 border-b border-gray-300'>
            Upload Image
          </h4>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                store.setUploadedImage(e.target.files[0]);
              }
            }}
          />
        </div>
      )}
    </div>
  );
});

export default ControlPanel;
