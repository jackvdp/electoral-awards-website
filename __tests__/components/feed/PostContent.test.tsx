import React from 'react';
import { render, screen } from '@testing-library/react';
import PostContent from 'components/blocks/feed/PostContent';

describe('PostContent', () => {
    it('renders plain text without mentions', () => {
        render(<PostContent text="Hello world" />);
        expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('renders a mention as a highlighted span', () => {
        render(<PostContent text="Hello @[Jane Smith](user-1) how are you?" />);

        expect(screen.getByText('Hello')).toBeInTheDocument();
        const mention = screen.getByText('Jane Smith');
        expect(mention).toBeInTheDocument();
        expect(mention.tagName).toBe('SPAN');
        expect(mention.className).toContain('text-primary');
    });

    it('renders multiple mentions', () => {
        render(<PostContent text="@[Jane](u1) and @[John](u2) are here" />);

        expect(screen.getByText('Jane')).toBeInTheDocument();
        expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('renders empty text without errors', () => {
        const { container } = render(<PostContent text="" />);
        expect(container.textContent).toBe('');
    });

    it('preserves whitespace in content', () => {
        const { container } = render(<PostContent text="Line one" />);
        expect(container.querySelector('div')).toHaveStyle({ whiteSpace: 'pre-wrap' });
    });
});
