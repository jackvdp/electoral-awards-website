import Image from 'next/image';
import {DetailedHTMLProps, FC, HTMLAttributes} from 'react';
import styles from './SquareImage.module.css';

interface FigureImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    src: string;
    width: number;
    height: number;
    className?: string;
}

const SquareImage: FC<FigureImageProps> = (props) => {
    const {className = '', src, width, height, ...others} = props;

    return (
        <figure
            className={`${styles.square} ${className}`}
            {...others}
        >
            <div className={styles.imageContainer}>
                <Image
                    src={src}
                    alt=""
                    fill
                    sizes="100%"
                    className={styles.image}
                    quality={100}
                />
            </div>
        </figure>
    );
};

export default SquareImage;