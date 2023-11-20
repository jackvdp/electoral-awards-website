import React, { useEffect, useState } from 'react';
import ImageCard from './ImageCard';
import useLightBox from 'hooks/useLightBox';
import { FolderStructure } from 'aws/getFilesFolders';
import useProgressbar from 'hooks/useProgressbar';

const batchSize = 48;

const ImageGallery: React.FC = () => {
    useLightBox();
    useProgressbar();
    const [photosFolders, setPhotosFolders] = useState<FolderStructure[]>([]);
    const [renderedImagesCount, setRenderedImagesCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/images')
            .then(response => response.json())
            .then(data => {
                setPhotosFolders(data);
            });
    }, []);

    useEffect(() => {
        setRenderedImagesCount(batchSize);
    }, [photosFolders]);

    const loadMoreImages = () => {
        setRenderedImagesCount(prevCount => prevCount + batchSize);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

            if (window.innerHeight + scrollTop >= scrollHeight - window.innerHeight) {
                if (!loading) {
                    setLoading(true);
                    loadMoreImages();
                }
            } else {
                setLoading(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreImages]);

    const flattenFoldersToFiles = (folders: FolderStructure[]): string[] => {
        return folders.flatMap(folder => folder.files);
    }

    return (
        <main className="content-wrapper">
            <section className="wrapper bg-light px-md-20 px-2 py-md-10 py-5 container">
                <div className="row gy-6">
                    {photosFolders.length !== 0 ?
                        flattenFoldersToFiles(photosFolders).slice(0, renderedImagesCount).map((file, index) => (
                            <ImageCard key={index} imageURL={file} />
                        ))
                        :
                        <div className="progressbar semi-circle blue" data-value="100" />
                    }
                </div>
            </section>
        </main>
    );
};

export default ImageGallery;