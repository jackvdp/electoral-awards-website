import React from 'react';
import { render, screen } from '@testing-library/react';
import LinkPreview from 'components/blocks/feed/LinkPreview';

describe('LinkPreview', () => {
    it('renders title and description', () => {
        render(
            <LinkPreview
                url="https://example.com"
                title="Example Site"
                description="A great website"
            />
        );

        expect(screen.getByText('Example Site')).toBeInTheDocument();
        expect(screen.getByText('A great website')).toBeInTheDocument();
    });

    it('renders the URL domain', () => {
        render(
            <LinkPreview
                url="https://www.example.com/article/123"
                title="Article"
            />
        );

        expect(screen.getByText('www.example.com')).toBeInTheDocument();
    });

    it('renders an image when provided', () => {
        render(
            <LinkPreview
                url="https://example.com"
                title="With Image"
                image="https://example.com/img.jpg"
            />
        );

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://example.com/img.jpg');
    });

    it('renders without an image gracefully', () => {
        const { container } = render(
            <LinkPreview
                url="https://example.com"
                title="No Image"
            />
        );

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByText('No Image')).toBeInTheDocument();
    });

    it('links to the URL', () => {
        render(
            <LinkPreview
                url="https://example.com/page"
                title="Linked"
            />
        );

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://example.com/page');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('truncates long descriptions', () => {
        const longDesc = 'A'.repeat(300);
        render(
            <LinkPreview
                url="https://example.com"
                title="Long"
                description={longDesc}
            />
        );

        const desc = screen.getByText(/^A+/);
        expect(desc.textContent!.length).toBeLessThanOrEqual(203); // 200 + "..."
    });
});
