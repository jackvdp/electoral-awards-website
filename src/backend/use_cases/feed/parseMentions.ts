// Mention format in post content: @[Display Name](userId)
const MENTION_REGEX = /@\[([^\]]+)\]\(([^)]+)\)/g;

interface MentionParseResult {
    mentionIds: string[];
    cleanText: string;
}

type MentionToken =
    | { type: 'text'; value: string }
    | { type: 'mention'; value: string; userId: string };

function parseMentions(text: string): MentionParseResult {
    if (!text) {
        return { mentionIds: [], cleanText: '' };
    }

    const ids = new Set<string>();
    let match;
    const regex = new RegExp(MENTION_REGEX.source, 'g');

    while ((match = regex.exec(text)) !== null) {
        ids.add(match[2]);
    }

    return {
        mentionIds: Array.from(ids),
        cleanText: text,
    };
}

function renderMentionText(text: string): MentionToken[] {
    if (!text) {
        return [];
    }

    const segments: MentionToken[] = [];
    const regex = new RegExp(MENTION_REGEX.source, 'g');
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
        }
        segments.push({ type: 'mention', value: match[1], userId: match[2] });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        segments.push({ type: 'text', value: text.slice(lastIndex) });
    }

    return segments;
}

export { parseMentions, renderMentionText };
export type { MentionToken, MentionParseResult };
