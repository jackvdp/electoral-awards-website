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

const baseAuthors = { 'user-1': baseAuthor };
const noop = jest.fn();

const renderCard = (overrides: Record<string, any> = {}) =>
    render(
        <PostCard
            post={basePost}
            author={baseAuthor}
            authors={baseAuthors}
            currentUserId="user-1"
            isAdmin={false}
            onDelete={noop}
            onAuthorsLoaded={noop}
            {...overrides}
        />
    );

describe('PostCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the post content', () => {
        renderCard();
        expect(screen.getByText('Test post content')).toBeInTheDocument();
    });

    it('renders the author name and organisation', () => {
        renderCard();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText(/Electoral Commission/)).toBeInTheDocument();
    });

    it('shows initials when no profile image', () => {
        renderCard({ author: { ...baseAuthor, profile_image: '' } });
        expect(screen.getByText('JS')).toBeInTheDocument();
    });

    it('shows "Unknown member" when author is undefined', () => {
        renderCard({ author: undefined });
        expect(screen.getByText('Unknown member')).toBeInTheDocument();
    });

    it('shows delete menu for the post author', () => {
        renderCard();
        const menuButton = screen.getByRole('button', { name: '' });
        expect(menuButton).toBeInTheDocument();
    });

    it('shows delete menu for admin even when not author', () => {
        renderCard({ currentUserId: 'admin-user', isAdmin: true });
        const buttons = screen.getAllByRole('button');
        const menuButton = buttons.find(btn => btn.querySelector('.uil-ellipsis-h'));
        expect(menuButton).toBeTruthy();
    });

    it('does not show delete menu for non-author, non-admin', () => {
        renderCard({ currentUserId: 'other-user', isAdmin: false });
        const buttons = screen.getAllByRole('button');
        const menuButton = buttons.find(btn => btn.querySelector('.uil-ellipsis-h'));
        expect(menuButton).toBeFalsy();
    });

    it('shows "edited" label when post was updated', () => {
        renderCard({
            post: { ...basePost, updatedAt: new Date(Date.now() + 60000).toISOString() },
        });
        expect(screen.getByText(/edited/)).toBeInTheDocument();
    });

    it('shows "just now" for a recent post', () => {
        renderCard();
        expect(screen.getByText(/just now/)).toBeInTheDocument();
    });

    it('toggles comment section when comment button is clicked', () => {
        renderCard();
        const commentButton = screen.getByText('Comment');
        fireEvent.click(commentButton);

        // CommentSection should now be rendered (it shows a spinner while loading)
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});
