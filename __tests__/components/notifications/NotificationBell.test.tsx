import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import NotificationBell from 'components/blocks/notifications/NotificationBell';

global.fetch = jest.fn();

describe('NotificationBell', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders the bell icon', () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => [],
        });

        render(<NotificationBell />);
        expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
    });

    it('shows unread count badge when there are unread notifications', async () => {
        const notifications = [
            { _id: 'n1', type: 'like_post', read: false },
            { _id: 'n2', type: 'comment', read: false },
        ];

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => notifications,
        });

        render(<NotificationBell />);

        await waitFor(() => {
            expect(screen.getByText('2')).toBeInTheDocument();
        });
    });

    it('hides badge when there are no unread notifications', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => [],
        });

        render(<NotificationBell />);

        await waitFor(() => {
            expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
        });
    });

    it('fetches unread notifications on mount', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => [],
        });

        render(<NotificationBell />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/notifications?unread=true');
        });
    });
});
