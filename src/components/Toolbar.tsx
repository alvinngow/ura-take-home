import { observer } from 'mobx-react-lite';
import React from 'react';
import { EditorStore } from '../store/editorStore';
import { ToolType } from '../types/enums';
import {
  IconBucketDroplet,
  IconDeviceFloppy,
  IconPencil,
  IconPhoto,
  IconTriangleSquareCircle,
} from '@tabler/icons-react';

interface ToolbarProps {
  store: EditorStore;
}

const Toolbar: React.FC<ToolbarProps> = observer(({ store }) => {
  return (
    <div className='flex p-3 bg-gray-700 border-b border-gray-600 justify-between'>
      <div className='flex'>
        <button
          className={`flex flex-col items-center px-4 py-2 mr-2 rounded ${
            store.selectedTool === ToolType.SHAPE
              ? 'bg-gray-600'
              : 'bg-transparent hover:bg-gray-600'
          } text-white`}
          onClick={() => store.setSelectedTool(ToolType.SHAPE)}
        >
          <IconTriangleSquareCircle />
          <span>Shape</span>
        </button>
        <button
          className={`flex flex-col items-center px-4 py-2 mr-2 rounded ${
            store.selectedTool === ToolType.FILL
              ? 'bg-gray-600'
              : 'bg-transparent hover:bg-gray-600'
          } text-white`}
          onClick={() => store.setSelectedTool(ToolType.FILL)}
        >
          <IconBucketDroplet />
          <span>Fill</span>
        </button>
        <button
          className={`flex flex-col items-center px-4 py-2 mr-2 rounded ${
            store.selectedTool === ToolType.PEN
              ? 'bg-gray-600'
              : 'bg-transparent hover:bg-gray-600'
          } text-white`}
          onClick={() => store.setSelectedTool(ToolType.PEN)}
        >
          <IconPencil />
          <span>Pen</span>
        </button>
        <button
          className={`flex flex-col items-center px-4 py-2 mr-2 rounded ${
            store.selectedTool === ToolType.IMAGE
              ? 'bg-gray-600'
              : 'bg-transparent hover:bg-gray-600'
          } text-white`}
          onClick={() => store.setSelectedTool(ToolType.IMAGE)}
        >
          <IconPhoto />
          <span>Image</span>
        </button>
      </div>
      <div>
        <button
          className={`flex flex-col items-center px-4 py-2 mr-2 rounded ${
            store.selectedTool === ToolType.IMAGE
              ? 'bg-gray-600'
              : 'bg-transparent hover:bg-gray-600'
          } text-white`}
          onClick={() => store.saveCanvasAsImage()}
        >
          <IconDeviceFloppy />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
});

export default Toolbar;
