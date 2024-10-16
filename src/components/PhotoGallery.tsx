import React, { useState } from 'react';
import PhotoModal from './PhotoModal';
import ProgressiveImage from './ProgressiveImage';
import { Trash2 } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  category: string;
  thumbnailUrl?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  onDeletePhoto: (photoId: string) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onDeletePhoto }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden relative group"
          >
            <div 
              className="cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <ProgressiveImage
                src={photo.url}
                placeholder={photo.thumbnailUrl || photo.url}
                alt="Foto de boda"
                className="w-full h-64 object-cover"
              />
              <div className="p-2 text-sm text-gray-600">{photo.category}</div>
            </div>
            <button
              onClick={() => onDeletePhoto(photo.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      {selectedPhoto && (
        <PhotoModal 
          photo={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)}
          photos={photos}
          onDeletePhoto={onDeletePhoto}
        />
      )}
    </>
  );
};

export default PhotoGallery;