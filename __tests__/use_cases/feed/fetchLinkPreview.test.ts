import fetchLinkPreview from 'backend/use_cases/feed/fetchLinkPreview';

// Mock global fetch
global.fetch = jest.fn();

describe('fetchLinkPreview', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return null for an empty URL', async () => {
        const result = await fetchLinkPreview('');
        expect(result).toBeNull();
    });

    it('should return null for an invalid URL', async () => {
        const result = await fetchLinkPreview('not-a-url');
        expect(result).toBeNull();
    });

    it('should parse Open Graph meta tags from HTML', async () => {
        const html = `
            <html>
            <head>
                <meta property="og:title" content="Test Article" />
                <meta property="og:description" content="A description of the article" />
                <meta property="og:image" content="https://example.com/image.jpg" />
            </head>
            <body></body>
            </html>
        `;

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            headers: { get: () => 'text/html' },
            text: async () => html,
        });

        const result = await fetchLinkPreview('https://example.com/article');

        expect(result).toEqual({
            url: 'https://example.com/article',
            title: 'Test Article',
            description: 'A description of the article',
            image: 'https://example.com/image.jpg',
        });
    });

    it('should fall back to <title> tag when no og:title', async () => {
        const html = `
            <html>
            <head>
                <title>Fallback Title</title>
                <meta name="description" content="A meta description" />
            </head>
            <body></body>
            </html>
        `;

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            headers: { get: () => 'text/html' },
            text: async () => html,
        });

        const result = await fetchLinkPreview('https://example.com/page');

        expect(result).toEqual({
            url: 'https://example.com/page',
            title: 'Fallback Title',
            description: 'A meta description',
            image: undefined,
        });
    });

    it('should return null when fetch fails', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        const result = await fetchLinkPreview('https://example.com');
        expect(result).toBeNull();
    });

    it('should return null for non-HTML responses', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            headers: { get: () => 'application/json' },
            text: async () => '{}',
        });

        const result = await fetchLinkPreview('https://example.com/api');
        expect(result).toBeNull();
    });

    it('should return null when response is not ok', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            headers: { get: () => 'text/html' },
        });

        const result = await fetchLinkPreview('https://example.com/404');
        expect(result).toBeNull();
    });

    it('should handle twitter:title and twitter:description', async () => {
        const html = `
            <html>
            <head>
                <meta name="twitter:title" content="Twitter Title" />
                <meta name="twitter:description" content="Twitter desc" />
                <meta name="twitter:image" content="https://example.com/tw.jpg" />
            </head>
            <body></body>
            </html>
        `;

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            headers: { get: () => 'text/html' },
            text: async () => html,
        });

        const result = await fetchLinkPreview('https://example.com/tweet');

        expect(result).toEqual({
            url: 'https://example.com/tweet',
            title: 'Twitter Title',
            description: 'Twitter desc',
            image: 'https://example.com/tw.jpg',
        });
    });
});
