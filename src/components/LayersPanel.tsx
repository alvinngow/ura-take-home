import { observer } from 'mobx-react-lite';
import React from 'react';
import { EditorStore } from '../store/editorStore';
import { IconTrash } from '@tabler/icons-react';

interface LayersPanelProps {
  store: EditorStore;
}

const LayersPanel: React.FC<LayersPanelProps> = observer(({ store }) => {
  return (
    <div className='p-4'>
      <h3 className='text-lg font-semibold pb-3 mb-4 border-b border-gray-300'>
        Layers
      </h3>
      <div className='flex flex-col gap-2'>
        {store.layers.length === 0 ? (
          <p className='text-gray-500 text-center'>
            No layers yet. Start drawing!
          </p>
        ) : (
          store.layers
            .map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center p-2 bg-white border ${
                  layer.visible
                    ? 'border-gray-300'
                    : 'border-gray-200 opacity-50'
                } rounded`}
              >
                <button
                  className='mr-3 text-lg'
                  onClick={() => store.toggleLayerVisibility(layer.id)}
                >
                  {layer.visible ? '👁️' : '👁️‍🗨️'}
                </button>
                <div className='flex-1'>
                  <span className='block font-medium'>{layer.name}</span>
                  <span className='block text-xs text-gray-500'>
                    {layer.type}
                  </span>
                </div>
                <button
                  className='mr-3 text-lg cursor-pointer'
                  onClick={() => store.deleteLayer(layer.id)}
                >
                  <IconTrash />
                </button>
              </div>
            ))
            .reverse()
        )}
      </div>
    </div>
  );
});

export default LayersPanel;
