import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, LogIn } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ProgressiveImage from './ProgressiveImage';

interface Photo {
  id: string;
  url: string;
  category: string;
  thumbnailUrl?: string;
}

function PublicGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const querySnapshot = await getDocs(collection(db, "photos"));
      const fetchedPhotos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        url: doc.data().url,
        category: doc.data().category || 'Sin categoría',
        thumbnailUrl: doc.data().thumbnailUrl
      }));
      setPhotos(fetchedPhotos);
    };

    fetchPhotos();
  }, []);

  const categories = ['Ceremonia', 'Fiesta', 'Invitados', 'Detalles', 'Sin categoría'];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ImageIcon className="mr-2" />
            Nuestro Casamiento
          </h1>
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <LogIn className="mr-2" />
            Iniciar Sesión
          </Link>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos
              .filter(photo => !selectedCategory || photo.category === selectedCategory)
              .map((photo) => (
                <div 
                  key={photo.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <ProgressiveImage
                    src={photo.url}
                    placeholder={photo.thumbnailUrl || photo.url}
                    alt="Foto de boda"
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-2 text-sm text-gray-600">{photo.category}</div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PublicGallery;