import React, { useEffect, useState } from 'react';
import ImageCard from './ImageCard';
import useLightBox from 'hooks/useLightBox';

const ImageGallery: React.FC = () => {
    useLightBox();
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        fetch('/api/images')
            .then(response => response.json())
            .then(data => {
                setImages(data.images.slice(1));
            })
            .catch(error => console.error('Error fetching images:', error));
    }, []);

    return (
        <main className="content-wrapper">

            <section className="wrapper bg-light px-md-20 px-2 py-md-10 py-5 container">
                <div className="row gy-6">
                    {images.map((imageUrl) => (
                        <ImageCard imageURL={imageUrl} />
                    ))}
                </div>
            </section>

        </main>
    );
};

export default ImageGallery;
