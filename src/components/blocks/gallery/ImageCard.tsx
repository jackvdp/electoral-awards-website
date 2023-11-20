import styles from './ImageCard.module.css';
import useLightBox from 'hooks/useLightBox';
import Image from 'next/image';
import React from 'react';

const ImageCard: React.FC<ImageCardProps> = ({ imageURL }) => {
    useLightBox()

    return (
        <div className="col-md-3 col-4">
            <div className={styles.squareContainer}>
                <figure className={`overlay overlay-1 hover-scale rounded ${styles.figure}`}>
                    <a
                        href={imageURL}
                        data-gallery="gallery-image"
                        data-glightbox=""
                    >
                        <Image
                            src={replacePhotoWithThumbnail(imageURL)}
                            alt="Image"
                            layout="fill"
                            objectFit="cover"
                            className={styles.image}
                        />
                        <span className="bg" />
                    </a>
                </figure>
            </div>
        </div>
    )

    function replacePhotoWithThumbnail(url: string): string {
        return url.replace("/photos/", "/thumbnails/");
    }
}

export default ImageCard

interface ImageCardProps {
    imageURL: string;
}