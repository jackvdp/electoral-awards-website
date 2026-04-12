import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentComposer from 'components/blocks/feed/CommentComposer';

global.fetch = jest.fn();

describe('CommentComposer', () => {
    const mockOnCommentCreated = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockReset();
    });

    it('renders the comment input', () => {
        render(<CommentComposer postId="post-1" onCommentCreated={mockOnCommentCreated} />);
        expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
    });

    it('disables submit button when input is empty', () => {
        render(<CommentComposer postId="post-1" onCommentCreated={mockOnCommentCreated} />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('enables submit button when text is entered', async () => {
        const user = userEvent.setup();
        render(<CommentComposer postId="post-1" onCommentCreated={mockOnCommentCreated} />);

        const input = screen.getByPlaceholderText('Write a comment...');
        await user.type(input, 'Great post!');

        const button = screen.getByRole('button');
        expect(button).toBeEnabled();
    });

    it('submits and clears input on success', async () => {
        const user = userEvent.setup();
        const newComment = { _id: 'c-1', content: 'Great post!', likes: [] };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => newComment,
        });

        render(<CommentComposer postId="post-1" onCommentCreated={mockOnCommentCreated} />);

        const input = screen.getByPlaceholderText('Write a comment...');
        await user.type(input, 'Great post!');
        await user.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(mockOnCommentCreated).toHaveBeenCalledWith(newComment);
        });

        expect(input).toHaveValue('');
    });

    it('calls the correct API endpoint', async () => {
        const user = userEvent.setup();

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ _id: 'c-1' }),
        });

        render(<CommentComposer postId="post-42" onCommentCreated={mockOnCommentCreated} />);

        const input = screen.getByPlaceholderText('Write a comment...');
        await user.type(input, 'Test');
        await user.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/feed/post-42/comments',
                expect.objectContaining({ method: 'POST' })
            );
        });
    });
});
