import styles from './ImageCard.module.css';
import useLightBox from 'hooks/useLightBox';


const ImageCard: React.FC<ImageCardProps> = ({ imageURL }) => {

    useLightBox()

    return (
        <div className="col-md-3">
            <div className={styles.squareContainer}>
                <figure className={`overlay overlay-1 hover-scale rounded ${styles.figure}`}>
                    <a
                        href={imageURL}
                        data-gallery="gallery-image"
                        data-glightbox=""
                    >
                        <img
                            src={imageURL}
                            alt=""
                        />
                        <span className="bg" />
                    </a>

                </figure>
            </div>
        </div>
    )
}

export default ImageCard

interface ImageCardProps {
    imageURL: string;
}