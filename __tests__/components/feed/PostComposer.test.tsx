import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostComposer from 'components/blocks/feed/PostComposer';

// Mock fetch
global.fetch = jest.fn();

describe('PostComposer', () => {
    const mockOnPostCreated = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockReset();
    });

    it('renders the composer with placeholder text', () => {
        render(<PostComposer onPostCreated={mockOnPostCreated} userFirstname="Jack" />);

        expect(screen.getByPlaceholderText("What's on your mind, Jack?")).toBeInTheDocument();
    });

    it('renders generic placeholder when no name provided', () => {
        render(<PostComposer onPostCreated={mockOnPostCreated} />);

        expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
    });

    it('disables the Post button when content is empty', () => {
        render(<PostComposer onPostCreated={mockOnPostCreated} />);

        const button = screen.getByRole('button', { name: 'Post' });
        expect(button).toBeDisabled();
    });

    it('enables the Post button when content is entered', async () => {
        const user = userEvent.setup();
        render(<PostComposer onPostCreated={mockOnPostCreated} />);

        const textarea = screen.getByPlaceholderText("What's on your mind?");
        await user.type(textarea, 'Hello world');

        const button = screen.getByRole('button', { name: 'Post' });
        expect(button).toBeEnabled();
    });

    it('shows character count', async () => {
        const user = userEvent.setup();
        render(<PostComposer onPostCreated={mockOnPostCreated} />);

        expect(screen.getByText('0/1000')).toBeInTheDocument();

        const textarea = screen.getByPlaceholderText("What's on your mind?");
        await user.type(textarea, 'Hello');

        expect(screen.getByText('5/1000')).toBeInTheDocument();
    });

    it('submits the post and clears the input on success', async () => {
        const user = userEvent.setup();
        const newPost = { _id: 'post-1', content: 'Hello world', likes: [], commentCount: 0 };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => newPost,
        });

        render(<PostComposer onPostCreated={mockOnPostCreated} />);

        const textarea = screen.getByPlaceholderText("What's on your mind?");
        await user.type(textarea, 'Hello world');
        await user.click(screen.getByRole('button', { name: 'Post' }));

        await waitFor(() => {
            expect(mockOnPostCreated).toHaveBeenCalledWith(newPost);
        });

        expect(textarea).toHaveValue('');
    });

    it('shows an error message on failed submission', async () => {
        const user = userEvent.setup();

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'Rate limit exceeded' }),
        });

        render(<PostComposer onPostCreated={mockOnPostCreated} />);

        const textarea = screen.getByPlaceholderText("What's on your mind?");
        await user.type(textarea, 'Hello world');
        await user.click(screen.getByRole('button', { name: 'Post' }));

        await waitFor(() => {
            expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument();
        });
    });
});
