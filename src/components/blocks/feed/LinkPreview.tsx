import { FC } from 'react';

interface LinkPreviewProps {
    url: string;
    title?: string;
    description?: string;
    image?: string;
}

function getDomain(url: string): string {
    try {
        return new URL(url).hostname;
    } catch {
        return url;
    }
}

function truncate(text: string, max: number): string {
    if (text.length <= max) return text;
    return text.slice(0, max) + '...';
}

const LinkPreview: FC<LinkPreviewProps> = ({ url, title, description, image }) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="card border rounded-3 overflow-hidden text-decoration-none text-reset d-block mt-2"
        >
            {image && (
                <img
                    src={image}
                    alt={title || ''}
                    className="card-img-top"
                    style={{ maxHeight: 250, objectFit: 'cover' }}
                />
            )}

            <div className="card-body py-2 px-3">
                <small className="text-muted fs-12">{getDomain(url)}</small>
                {title && <h6 className="mb-1 fs-14">{title}</h6>}
                {description && (
                    <p className="mb-0 text-muted fs-13">{truncate(description, 200)}</p>
                )}
            </div>
        </a>
    );
};

export default LinkPreview;
