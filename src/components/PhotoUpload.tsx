import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import imageCompression from 'browser-image-compression';

interface PhotoUploadProps {
  onPhotoUpload: (photo: { id: string; url: string; category: string; thumbnailUrl: string }) => void;
  categories: string[];
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoUpload, categories }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState(categories[0]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const compressImage = async (file: File, options: { maxSizeMB: number, maxWidthOrHeight: number }) => {
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFile) {
      setUploading(true);
      try {
        // Compress the original image
        const compressedFile = await compressImage(selectedFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920
        });

        // Create a thumbnail
        const thumbnailFile = await compressImage(selectedFile, {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 300
        });

        // Upload original (compressed) image
        const storageRef = ref(storage, `wedding-photos/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(storageRef, compressedFile);
        const downloadURL = await getDownloadURL(storageRef);

        // Upload thumbnail
        const thumbnailRef = ref(storage, `wedding-photos/thumbnails/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(thumbnailRef, thumbnailFile);
        const thumbnailURL = await getDownloadURL(thumbnailRef);

        onPhotoUpload({ 
          id: storageRef.fullPath, 
          url: downloadURL, 
          category,
          thumbnailUrl: thumbnailURL
        });
      } catch (error) {
        console.error("Error uploading file: ", error);
        alert("Error al subir la foto. Por favor, intente de nuevo.");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Subir Nueva Foto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
            Seleccionar Foto
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            !selectedFile || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          <Upload className="mr-2" />
          {uploading ? 'Subiendo...' : 'Subir Foto'}
        </button>
      </form>
    </div>
  );
};

export default PhotoUpload;