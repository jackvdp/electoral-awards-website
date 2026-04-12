import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import NotificationDropdown, { NotificationItem } from './NotificationDropdown';

const NotificationBell: FC = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [authors, setAuthors] = useState<Record<string, any>>({});
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
    const bellRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await fetch('/api/notifications?unread=true');
            if (res.ok) {
                const data = await res.json();
                setUnreadCount(data.length);
            }
        } catch {
            // Silently fail
        }
    }, []);

    // Fetch unread count on mount and poll every 30s
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    // Close dropdown on outside click
    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                bellRef.current?.contains(target) ||
                dropdownRef.current?.contains(target)
            ) {
                return;
            }
            setOpen(false);
        };

        // Use setTimeout to avoid the current click event closing the dropdown
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const handleOpen = async () => {
        if (open) {
            setOpen(false);
            return;
        }

        // Position dropdown below the bell button
        if (bellRef.current) {
            const rect = bellRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }

        setOpen(true);

        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data: NotificationItem[] = await res.json();
                setNotifications(data);

                const actorIds = Array.from(new Set(data.map(n => n.actorId)));
                const missingIds = actorIds.filter(id => !authors[id]);

                if (missingIds.length > 0) {
                    const authorRes = await fetch(`/api/feed/authors?ids=${missingIds.join(',')}`);
                    if (authorRes.ok) {
                        const authorData = await authorRes.json();
                        setAuthors(prev => ({ ...prev, ...authorData }));
                    }
                }

                if (unreadCount > 0) {
                    await fetch('/api/notifications/read', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({}),
                    });
                    setUnreadCount(0);
                }
            }
        } catch {
            // Silently fail
        }
    };

    return (
        <>
            <a
                ref={bellRef as any}
                className="nav-link position-relative"
                role="button"
                onClick={handleOpen}
                aria-label="Notifications"
                style={{ cursor: 'pointer' }}
            >
                <i className="uil uil-bell" />
                {unreadCount > 0 && (
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: '0.65rem' }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </a>

            {open && typeof document !== 'undefined' && createPortal(
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'fixed',
                        top: dropdownPos.top,
                        right: dropdownPos.right,
                        zIndex: 1080,
                    }}
                >
                    <NotificationDropdown notifications={notifications} authors={authors} />
                </div>,
                document.body
            )}
        </>
    );
};

export default NotificationBell;
