import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostActions from 'components/blocks/feed/PostActions';

global.fetch = jest.fn();

describe('PostActions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    });

    it('renders like and comment buttons', () => {
        render(
            <PostActions
                postId="post-1"
                likeCount={0}
                commentCount={0}
                isLiked={false}
                onCommentToggle={jest.fn()}
            />
        );

        expect(screen.getByText('Like')).toBeInTheDocument();
        expect(screen.getByText('Comment')).toBeInTheDocument();
    });

    it('shows like count when there are likes', () => {
        render(
            <PostActions
                postId="post-1"
                likeCount={5}
                commentCount={0}
                isLiked={false}
                onCommentToggle={jest.fn()}
            />
        );

        expect(screen.getByText(/5/)).toBeInTheDocument();
        expect(screen.getByText(/Likes/)).toBeInTheDocument();
    });

    it('shows singular "Like" for 1 like', () => {
        render(
            <PostActions
                postId="post-1"
                likeCount={1}
                commentCount={0}
                isLiked={false}
                onCommentToggle={jest.fn()}
            />
        );

        expect(screen.getByText(/1/)).toBeInTheDocument();
        expect(screen.getByText(/^1 Like$/)).toBeInTheDocument();
    });

    it('shows comment count when there are comments', () => {
        render(
            <PostActions
                postId="post-1"
                likeCount={0}
                commentCount={3}
                isLiked={false}
                onCommentToggle={jest.fn()}
            />
        );

        expect(screen.getByText(/3/)).toBeInTheDocument();
        expect(screen.getByText(/Comments/)).toBeInTheDocument();
    });

    it('applies primary style when liked', () => {
        render(
            <PostActions
                postId="post-1"
                likeCount={1}
                commentCount={0}
                isLiked={true}
                onCommentToggle={jest.fn()}
            />
        );

        const likeButton = screen.getAllByRole('button')[0];
        expect(likeButton.className).toContain('text-primary');
    });

    it('optimistically updates like count on click', async () => {
        render(
            <PostActions
                postId="post-1"
                likeCount={0}
                commentCount={0}
                isLiked={false}
                onCommentToggle={jest.fn()}
            />
        );

        const likeButton = screen.getAllByRole('button')[0];
        fireEvent.click(likeButton);

        // Should optimistically show 1 like
        await waitFor(() => {
            expect(screen.getByText(/1 Like/)).toBeInTheDocument();
        });
    });

    it('calls onCommentToggle when comment button is clicked', () => {
        const mockToggle = jest.fn();

        render(
            <PostActions
                postId="post-1"
                likeCount={0}
                commentCount={0}
                isLiked={false}
                onCommentToggle={mockToggle}
            />
        );

        const commentButton = screen.getAllByRole('button')[1];
        fireEvent.click(commentButton);

        expect(mockToggle).toHaveBeenCalledTimes(1);
    });
});
