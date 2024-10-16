import React, { useState, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  placeholder: string;
  alt: string;
  className?: string;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ src, placeholder, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
    };
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`${className} ${imgSrc === placeholder ? 'blur-sm' : 'blur-0'} transition-all duration-500`}
    />
  );
};

export default ProgressiveImage;