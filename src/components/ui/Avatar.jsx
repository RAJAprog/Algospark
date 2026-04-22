import React from 'react';

const Avatar = ({ src, alt = "User Avatar", size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };
  
  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`${sizeClass} rounded-full bg-gray-600 flex items-center justify-center overflow-hidden border-2 border-gray-500`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-bold">{alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

export default Avatar;