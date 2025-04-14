import { observer } from 'mobx-react-lite';
import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import Canvas from './components/Canvas';
import ControlPanel from './components/ControlPanel';
import LayersPanel from './components/LayersPanel';
import Toolbar from './components/Toolbar';
import { EditorStore } from './store/editorStore';

const App: React.FC = observer(() => {
  const editorStore = useMemo(() => new EditorStore(), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        editorStore.undo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorStore]);

  useLayoutEffect(() => {
    const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    if (canvas) {
      editorStore.initializeCanvas(canvas);
    }

    return () => {
      editorStore.destroyCanvas();
    };
  }, [editorStore]);

  return (
    <div className='flex flex-col h-screen w-screen'>
      <div className='bg-gray-800 p-4'>
        <h1 className='text-3xl font-bold text-white'>Simple Picture Editor</h1>
      </div>
      <Toolbar store={editorStore} />
      <div className='flex flex-1 overflow-hidden'>
        <div className='w-64 bg-gray-100 border-r border-gray-300 overflow-y-auto'>
          <ControlPanel store={editorStore} />
        </div>
        <div className='flex-1 bg-white relative overflow-hidden'>
          <Canvas store={editorStore} />
        </div>
        <div className='w-64 bg-gray-100 border-l border-gray-300 overflow-y-auto'>
          <LayersPanel store={editorStore} />
        </div>
      </div>
    </div>
  );
});

export default App;
