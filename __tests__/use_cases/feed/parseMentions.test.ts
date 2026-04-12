import { parseMentions, renderMentionText, MentionToken } from 'backend/use_cases/feed/parseMentions';

describe('parseMentions', () => {
    it('should extract mention tokens from text', () => {
        const text = 'Hello @[Jane Smith](user-1) how are you?';
        const result = parseMentions(text);

        expect(result.mentionIds).toEqual(['user-1']);
        expect(result.cleanText).toBe(text);
    });

    it('should extract multiple mentions', () => {
        const text = '@[Jane Smith](user-1) and @[John Doe](user-2) are here';
        const result = parseMentions(text);

        expect(result.mentionIds).toEqual(['user-1', 'user-2']);
    });

    it('should return empty array when no mentions', () => {
        const text = 'No mentions here';
        const result = parseMentions(text);

        expect(result.mentionIds).toEqual([]);
        expect(result.cleanText).toBe('No mentions here');
    });

    it('should handle empty text', () => {
        const result = parseMentions('');

        expect(result.mentionIds).toEqual([]);
        expect(result.cleanText).toBe('');
    });

    it('should deduplicate mention IDs', () => {
        const text = '@[Jane Smith](user-1) said hi to @[Jane Smith](user-1)';
        const result = parseMentions(text);

        expect(result.mentionIds).toEqual(['user-1']);
    });
});

describe('renderMentionText', () => {
    it('should split text into segments with mentions', () => {
        const text = 'Hello @[Jane Smith](user-1) how are you?';
        const segments = renderMentionText(text);

        expect(segments).toEqual([
            { type: 'text', value: 'Hello ' },
            { type: 'mention', value: 'Jane Smith', userId: 'user-1' },
            { type: 'text', value: ' how are you?' },
        ]);
    });

    it('should handle text with no mentions', () => {
        const segments = renderMentionText('No mentions here');

        expect(segments).toEqual([
            { type: 'text', value: 'No mentions here' },
        ]);
    });

    it('should handle text that starts with a mention', () => {
        const segments = renderMentionText('@[Jane](u1) said hello');

        expect(segments).toEqual([
            { type: 'mention', value: 'Jane', userId: 'u1' },
            { type: 'text', value: ' said hello' },
        ]);
    });

    it('should handle text that ends with a mention', () => {
        const segments = renderMentionText('Hello @[Jane](u1)');

        expect(segments).toEqual([
            { type: 'text', value: 'Hello ' },
            { type: 'mention', value: 'Jane', userId: 'u1' },
        ]);
    });

    it('should handle consecutive mentions', () => {
        const segments = renderMentionText('@[Jane](u1)@[John](u2)');

        expect(segments).toEqual([
            { type: 'mention', value: 'Jane', userId: 'u1' },
            { type: 'mention', value: 'John', userId: 'u2' },
        ]);
    });

    it('should handle empty text', () => {
        const segments = renderMentionText('');
        expect(segments).toEqual([]);
    });
});
