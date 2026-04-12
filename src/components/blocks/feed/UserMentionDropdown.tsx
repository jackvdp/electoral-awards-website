import { FC } from 'react';

interface MentionUser {
    id: string;
    firstname: string;
    lastname: string;
    organisation?: string;
    profile_image?: string;
}

interface UserMentionDropdownProps {
    users: MentionUser[];
    onSelect: (user: MentionUser) => void;
    visible: boolean;
}

const UserMentionDropdown: FC<UserMentionDropdownProps> = ({ users, onSelect, visible }) => {
    if (!visible || users.length === 0) return null;

    return (
        <div
            className="dropdown-menu show shadow-lg w-100"
            style={{ maxHeight: 200, overflowY: 'auto' }}
        >
            {users.map(user => (
                <button
                    key={user.id}
                    className="dropdown-item d-flex align-items-center gap-2 py-2"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(user);
                    }}
                >
                    {user.profile_image ? (
                        <img
                            src={user.profile_image}
                            alt=""
                            className="rounded-circle"
                            width={28}
                            height={28}
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: 28, height: 28, fontSize: '0.65rem' }}
                        >
                            {user.firstname?.[0]}{user.lastname?.[0]}
                        </div>
                    )}

                    <div>
                        <div className="fw-bold fs-14">{user.firstname} {user.lastname}</div>
                        {user.organisation && (
                            <small className="text-muted fs-12">{user.organisation}</small>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
};

export type { MentionUser };
export default UserMentionDropdown;
