import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import PhotoUpload from './PhotoUpload';
import PhotoGallery from './PhotoGallery';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, deleteObject } from 'firebase/storage';

interface Photo {
  id: string;
  url: string;
  category: string;
  thumbnailUrl?: string;
}

function Dashboard() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showUpload, setShowUpload] = useState(false);
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

  const handlePhotoUpload = async (newPhoto: Photo) => {
    const docRef = await addDoc(collection(db, "photos"), {
      url: newPhoto.url,
      category: newPhoto.category,
      thumbnailUrl: newPhoto.thumbnailUrl
    });
    setPhotos([...photos, { ...newPhoto, id: docRef.id }]);
    setShowUpload(false);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
      try {
        await deleteDoc(doc(db, "photos", photoId));
        const photoToDelete = photos.find(photo => photo.id === photoId);
        if (photoToDelete) {
          const imageRef = ref(storage, photoToDelete.url);
          await deleteObject(imageRef);
          if (photoToDelete.thumbnailUrl) {
            const thumbnailRef = ref(storage, photoToDelete.thumbnailUrl);
            await deleteObject(thumbnailRef);
          }
        }
        setPhotos(photos.filter(photo => photo.id !== photoId));
      } catch (error) {
        console.error("Error al eliminar la foto:", error);
        alert("Hubo un error al eliminar la foto. Por favor, intenta de nuevo.");
      }
    }
  };

  const categories = ['Ceremonia', 'Fiesta', 'Invitados', 'Detalles', 'Sin categoría'];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ImageIcon className="mr-2" />
            Dashboard - Nuestro Casamiento
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <Upload className="mr-2" />
              Subir Foto
            </button>
            <Link
              to="/"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <LogOut className="mr-2" />
              Salir
            </Link>
          </div>
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
          {showUpload ? (
            <PhotoUpload onPhotoUpload={handlePhotoUpload} categories={categories} />
          ) : (
            <PhotoGallery 
              photos={selectedCategory ? photos.filter(photo => photo.category === selectedCategory) : photos} 
              onDeletePhoto={handleDeletePhoto}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;