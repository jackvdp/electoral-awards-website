import { FC, ReactNode } from 'react';
import { renderMentionText } from 'backend/use_cases/feed/parseMentions';

const URL_REGEX = /(https?:\/\/[^\s<]+)/g;

interface PostContentProps {
    text: string;
}

function linkifyText(text: string): ReactNode[] {
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;
    const regex = new RegExp(URL_REGEX.source, 'g');

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        const url = match[1];
        parts.push(
            <a key={match.index} href={url} target="_blank" rel="noopener noreferrer">
                {url}
            </a>
        );
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
}

const PostContent: FC<PostContentProps> = ({ text }) => {
    if (!text) return null;

    const segments = renderMentionText(text);

    return (
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {segments.map((segment, i) => {
                if (segment.type === 'mention') {
                    return (
                        <span key={i} className="fw-bold text-primary">
                            {segment.value}
                        </span>
                    );
                }
                return <span key={i}>{linkifyText(segment.value)}</span>;
            })}
        </div>
    );
};

export default PostContent;
