import { FC } from 'react';
import { renderMentionText } from 'backend/use_cases/feed/parseMentions';

interface PostContentProps {
    text: string;
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
                return <span key={i}>{segment.value}</span>;
            })}
        </div>
    );
};

export default PostContent;
