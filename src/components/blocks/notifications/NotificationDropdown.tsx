import { FC } from 'react';

interface NotificationItem {
    _id: string;
    type: string;
    actorId: string;
    postId?: string;
    commentId?: string;
    read: boolean;
    createdAt: string;
}

interface NotificationDropdownProps {
    notifications: NotificationItem[];
    authors: Record<string, { id: string; firstname: string; lastname: string }>;
}

function getNotificationText(type: string): string {
    switch (type) {
        case 'like_post': return 'liked your post';
        case 'like_comment': return 'liked your comment';
        case 'comment': return 'commented on your post';
        case 'mention': return 'mentioned you';
        case 'reply': return 'replied to your comment';
        default: return 'interacted with your post';
    }
}

function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
}

const NotificationDropdown: FC<NotificationDropdownProps> = ({ notifications, authors }) => {
    if (notifications.length === 0) {
        return (
            <div className="dropdown-menu show shadow-lg p-3" style={{ minWidth: 300 }}>
                <p className="text-muted text-center mb-0 py-3">No notifications</p>
            </div>
        );
    }

    return (
        <div className="dropdown-menu show shadow-lg py-2" style={{ minWidth: 320, maxHeight: 400, overflowY: 'auto' }}>
            {notifications.map(n => {
                const actor = authors[n.actorId];
                const actorName = actor ? `${actor.firstname} ${actor.lastname}` : 'Someone';

                return (
                    <div
                        key={n._id}
                        data-notification
                        className={`px-3 py-2 ${!n.read ? 'bg-soft-primary' : ''}`}
                    >
                        <div className="d-flex justify-content-between align-items-start">
                            <p className="mb-0 fs-14">
                                <strong>{actorName}</strong>{' '}
                                <span className="text-muted">{getNotificationText(n.type)}</span>
                            </p>
                            <small className="text-muted ms-2 flex-shrink-0">{timeAgo(n.createdAt)}</small>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export type { NotificationItem };
export default NotificationDropdown;
