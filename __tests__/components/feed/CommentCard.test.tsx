import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CommentCard from 'components/blocks/feed/CommentCard';

global.fetch = jest.fn();

const baseComment = {
    _id: 'comment-1',
    postId: 'post-1',
    authorId: 'user-1',
    content: 'Great post!',
    likes: [],
    createdAt: new Date().toISOString(),
};

const baseAuthor = {
    id: 'user-1',
    firstname: 'Jane',
    lastname: 'Smith',
    organisation: 'EC',
    profile_image: '',
};

describe('CommentCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    });

    it('renders comment content', () => {
        render(
            <CommentCard
                comment={baseComment}
                author={baseAuthor}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText('Great post!')).toBeInTheDocument();
    });

    it('renders author name', () => {
        render(
            <CommentCard
                comment={baseComment}
                author={baseAuthor}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('shows initials when no profile image', () => {
        render(
            <CommentCard
                comment={baseComment}
                author={baseAuthor}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText('JS')).toBeInTheDocument();
    });

    it('shows delete button for comment author', () => {
        render(
            <CommentCard
                comment={baseComment}
                author={baseAuthor}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('hides delete button for non-author, non-admin', () => {
        render(
            <CommentCard
                comment={baseComment}
                author={baseAuthor}
                currentUserId="other-user"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('shows delete button for admin', () => {
        render(
            <CommentCard
                comment={baseComment}
                author={baseAuthor}
                currentUserId="admin-user"
                isAdmin={true}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('shows like button', () => {
        render(
            <CommentCard
                comment={baseComment}
                author={baseAuthor}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText('Like')).toBeInTheDocument();
    });

    it('shows like count when there are likes', () => {
        render(
            <CommentCard
                comment={{ ...baseComment, likes: ['user-2', 'user-3'] }}
                author={baseAuthor}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText('Like (2)')).toBeInTheDocument();
    });
});
