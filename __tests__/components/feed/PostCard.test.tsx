import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostCard from 'components/blocks/feed/PostCard';

global.fetch = jest.fn();

const basePost = {
    _id: 'post-1',
    authorId: 'user-1',
    content: 'Test post content',
    likes: [],
    commentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const baseAuthor = {
    id: 'user-1',
    firstname: 'Jane',
    lastname: 'Smith',
    organisation: 'Electoral Commission',
    profile_image: '',
};

describe('PostCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the post content', () => {
        render(
            <PostCard
                post={basePost}
                author={baseAuthor}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText('Test post content')).toBeInTheDocument();
    });

    it('renders the author name and organisation', () => {
        render(
            <PostCard
                post={basePost}
                author={baseAuthor}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText(/Electoral Commission/)).toBeInTheDocument();
    });

    it('shows initials when no profile image', () => {
        render(
            <PostCard
                post={basePost}
                author={{ ...baseAuthor, profile_image: '' }}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText('JS')).toBeInTheDocument();
    });

    it('shows "Unknown member" when author is undefined', () => {
        render(
            <PostCard
                post={basePost}
                author={undefined}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText('Unknown member')).toBeInTheDocument();
    });

    it('shows delete menu for the post author', () => {
        render(
            <PostCard
                post={basePost}
                author={baseAuthor}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        // The ellipsis menu button should exist
        const menuButton = screen.getByRole('button', { name: '' });
        expect(menuButton).toBeInTheDocument();
    });

    it('shows delete menu for admin even when not author', () => {
        render(
            <PostCard
                post={basePost}
                author={baseAuthor}
                currentUserId="admin-user"
                isAdmin={true}
                onDelete={jest.fn()}
            />
        );

        // Menu button should exist for admin
        const buttons = screen.getAllByRole('button');
        const menuButton = buttons.find(btn => btn.querySelector('.uil-ellipsis-h'));
        expect(menuButton).toBeTruthy();
    });

    it('does not show delete menu for non-author, non-admin', () => {
        render(
            <PostCard
                post={basePost}
                author={baseAuthor}
                currentUserId="other-user"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        const buttons = screen.getAllByRole('button');
        const menuButton = buttons.find(btn => btn.querySelector('.uil-ellipsis-h'));
        expect(menuButton).toBeFalsy();
    });

    it('shows "edited" label when post was updated', () => {
        const editedPost = {
            ...basePost,
            updatedAt: new Date(Date.now() + 60000).toISOString(),
        };

        render(
            <PostCard
                post={editedPost}
                author={baseAuthor}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText(/edited/)).toBeInTheDocument();
    });

    it('shows "just now" for a recent post', () => {
        render(
            <PostCard
                post={basePost}
                author={baseAuthor}
                currentUserId="user-1"
                isAdmin={false}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByText(/just now/)).toBeInTheDocument();
    });
});
