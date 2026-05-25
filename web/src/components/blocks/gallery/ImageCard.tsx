import styles from './ImageCard.module.css';
import useLightBox from 'hooks/useLightBox';
import Image from 'next/image';
import React from 'react';

interface ImageCardProps {
    imageURL: string;
}

const ImageCard: React.FC<ImageCardProps> = ({imageURL}) => {
    useLightBox()
    const thumbnail = imageURL.replace("/hd/", "/thumbnail/")

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
                            src={thumbnail}
                            alt="Image"
                            layout="fill"
                            objectFit="cover"
                            placeholder='blur'
                            loading={'lazy'}
                            blurDataURL='/img/photos/bg21.png'
                            className={styles.image}
                        />
                        <span className="bg"/>
                    </a>
                </figure>
            </div>
        </div>
    )
}

export default ImageCard;