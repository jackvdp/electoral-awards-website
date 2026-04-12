interface LinkPreviewData {
    url: string;
    title?: string;
    description?: string;
    image?: string;
}

function isValidUrl(str: string): boolean {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function getMetaContent(html: string, property: string): string | undefined {
    // Match property="..." or name="..."
    const propertyRegex = new RegExp(
        `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`,
        'i'
    );
    const match = html.match(propertyRegex);
    if (match) return match[1];

    // Also try content before property (some sites reverse the order)
    const reverseRegex = new RegExp(
        `<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`,
        'i'
    );
    const reverseMatch = html.match(reverseRegex);
    return reverseMatch?.[1];
}

function getTitleTag(html: string): string | undefined {
    const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match?.[1]?.trim();
}

async function fetchLinkPreview(url: string): Promise<LinkPreviewData | null> {
    if (!url || !isValidUrl(url)) {
        return null;
    }

    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'ElectoralNetworkBot/1.0' },
            signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) return null;

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('text/html')) return null;

        const html = await res.text();

        const title =
            getMetaContent(html, 'og:title') ||
            getMetaContent(html, 'twitter:title') ||
            getTitleTag(html);

        const description =
            getMetaContent(html, 'og:description') ||
            getMetaContent(html, 'twitter:description') ||
            getMetaContent(html, 'description');

        const image =
            getMetaContent(html, 'og:image') ||
            getMetaContent(html, 'twitter:image');

        if (!title && !description) return null;

        return {
            url,
            title,
            description,
            image: image || undefined,
        };
    } catch {
        return null;
    }
}

export type { LinkPreviewData };
export default fetchLinkPreview;
