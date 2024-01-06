import React, { useState } from 'react';

const FileCarousel = () => {
    const files = [
        { id: 1, name: 'Image 1', imageUrl: 'https://ongpng.com/wp-content/uploads/2023/01/20.Messi_2037x2244.png' },
        { id: 2, name: 'Image 2', imageUrl: 'https://ongpng.com/wp-content/uploads/2023/01/9.ronaldo_564x890-1.png' },
        { id: 3, name: 'Image 3', imageUrl: 'https://ongpng.com/wp-content/uploads/2023/01/20.Messi_2037x2244.png' },
        { id: 4, name: 'Image 4', imageUrl: 'https://ongpng.com/wp-content/uploads/2023/01/9.ronaldo_564x890-1.png' },
        { id: 5, name: 'Image 5', imageUrl: 'https://ongpng.com/wp-content/uploads/2023/01/9.ronaldo_564x890-1.png' },
    ];

    const [startIndex, setStartIndex] = useState(0);

    const nextSlide = () => {
        setStartIndex((prevIndex) => (prevIndex + 1) % files.length);
    };

    const prevSlide = () => {
        setStartIndex((prevIndex) => (prevIndex - 1 + files.length) % files.length);
    };

    const visibleFiles = files.slice(startIndex, startIndex + Math.min(4, files.length));

    return (
        <div className="flex items-center">
        {startIndex > 0 && (
            <button className="carousel-button mr-2 text-white" onClick={prevSlide}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            </button>
        )}
        <div className="flex space-x-2 transition-transform duration-300 ease-in-out transform translate-x-[-${startIndex * (100 / visibleFiles.length)}%]">
            {visibleFiles.map((file) => (
            <div key={file.id} className="file-slide">
                <img src={file.imageUrl} alt={file.name} className="w-16 h-16 object-cover" />
            </div>
            ))}
        </div>
        {startIndex + Math.min(4, files.length) < files.length && (
            <button className="carousel-button ml-2 text-white" onClick={nextSlide}>
            <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
        )}
        </div>
    );
};

export default FileCarousel;
