import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationDropdown from 'components/blocks/notifications/NotificationDropdown';

describe('NotificationDropdown', () => {
    const baseAuthors: Record<string, any> = {
        'user-2': { id: 'user-2', firstname: 'Jane', lastname: 'Smith' },
        'user-3': { id: 'user-3', firstname: 'John', lastname: 'Doe' },
    };

    it('shows empty state when no notifications', () => {
        render(<NotificationDropdown notifications={[]} authors={{}} />);
        expect(screen.getByText('No notifications')).toBeInTheDocument();
    });

    it('renders a like notification', () => {
        const notifications = [{
            _id: 'n1',
            type: 'like_post',
            actorId: 'user-2',
            postId: 'post-1',
            read: false,
            createdAt: new Date().toISOString(),
        }];

        render(<NotificationDropdown notifications={notifications} authors={baseAuthors} />);
        expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
        expect(screen.getByText(/liked your post/)).toBeInTheDocument();
    });

    it('renders a comment notification', () => {
        const notifications = [{
            _id: 'n2',
            type: 'comment',
            actorId: 'user-3',
            postId: 'post-1',
            read: false,
            createdAt: new Date().toISOString(),
        }];

        render(<NotificationDropdown notifications={notifications} authors={baseAuthors} />);
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
        expect(screen.getByText(/commented on your post/)).toBeInTheDocument();
    });

    it('renders a mention notification', () => {
        const notifications = [{
            _id: 'n3',
            type: 'mention',
            actorId: 'user-2',
            postId: 'post-1',
            read: false,
            createdAt: new Date().toISOString(),
        }];

        render(<NotificationDropdown notifications={notifications} authors={baseAuthors} />);
        expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
        expect(screen.getByText(/mentioned you/)).toBeInTheDocument();
    });

    it('styles unread notifications differently from read', () => {
        const notifications = [
            { _id: 'n1', type: 'like_post', actorId: 'user-2', postId: 'p1', read: false, createdAt: new Date().toISOString() },
            { _id: 'n2', type: 'comment', actorId: 'user-3', postId: 'p2', read: true, createdAt: new Date().toISOString() },
        ];

        const { container } = render(<NotificationDropdown notifications={notifications} authors={baseAuthors} />);

        const items = container.querySelectorAll('[data-notification]');
        expect(items.length).toBe(2);

        // First (unread) should have a bg highlight
        expect(items[0].className).toContain('bg-soft-primary');
        // Second (read) should not
        expect(items[1].className).not.toContain('bg-soft-primary');
    });
});
