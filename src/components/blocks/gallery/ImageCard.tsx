import styles from './ImageCard.module.css';

const ImageCard: React.FC<ImageCardProps> = ({ name }) => {
    return (
        <div className="col-md-3">
            <div className={styles.squareContainer}>
                <figure className={`overlay overlay-1 hover-scale rounded ${styles.figure}`}>
                    <a
                        href={`/img/judges/${name}`}
                        data-gallery="gallery-image"
                        data-glightbox=""
                    >
                        <img
                            src={`/img/judges/${name}`}
                            srcSet={`/img/judges/${name}`}
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
    name: string;
}