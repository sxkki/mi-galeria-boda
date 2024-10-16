import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Trash2 } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  category: string;
}

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
  photos: Photo[];
  onDeletePhoto: (photoId: string) => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose, photos, onDeletePhoto }) => {
  const [currentPhoto, setCurrentPhoto] = useState(photo);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') navigatePhoto(-1);
      if (event.key === 'ArrowRight') navigatePhoto(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPhoto]);

  const navigatePhoto = (direction: number) => {
    const currentIndex = photos.findIndex(p => p.id === currentPhoto.id);
    const newIndex = (currentIndex + direction + photos.length) % photos.length;
    setCurrentPhoto(photos[newIndex]);
    setZoomLevel(1);
  };

  const handleZoom = (factor: number) => {
    setZoomLevel(prevZoom => Math.max(0.5, Math.min(3, prevZoom + factor)));
  };

  const handleDelete = () => {
    onDeletePhoto(currentPhoto.id);
    if (photos.length > 1) {
      navigatePhoto(1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full h-full flex items-center justify-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-white">
          <X size={24} />
        </button>
        <button onClick={() => navigatePhoto(-1)} className="absolute left-4 text-white">
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => navigatePhoto(1)} className="absolute right-4 text-white">
          <ChevronRight size={24} />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button onClick={() => handleZoom(0.1)} className="bg-white rounded-full p-2">
            <ZoomIn size={20} />
          </button>
          <button onClick={() => handleZoom(-0.1)} className="bg-white rounded-full p-2">
            <ZoomOut size={20} />
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white rounded-full p-2">
            <Trash2 size={20} />
          </button>
        </div>
        <img 
          src={currentPhoto.url} 
          alt="Foto de boda" 
          className="max-w-full max-h-full object-contain transition-transform duration-200 ease-in-out"
          style={{ transform: `scale(${zoomLevel})` }}
        />
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-75 px-4 py-2 rounded-full">
          {currentPhoto.category}
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;