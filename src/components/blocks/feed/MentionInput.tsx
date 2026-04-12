import { FC, useState, useRef, useCallback, useEffect, ChangeEvent } from 'react';
import UserMentionDropdown, { MentionUser } from './UserMentionDropdown';

interface Mention {
    displayText: string; // e.g. "@Tracy Capaldi Drewett"
    userId: string;
    name: string;
}

interface MentionInputProps {
    value: string;            // display value (what the user sees)
    onChange: (displayValue: string) => void;
    onMentionsChange?: (mentions: Mention[]) => void;
    placeholder?: string;
    maxLength: number;
    disabled?: boolean;
    rows?: number;
    className?: string;
}

const MentionInput: FC<MentionInputProps> = ({
    value,
    onChange,
    onMentionsChange,
    placeholder,
    maxLength,
    disabled = false,
    rows = 3,
    className = 'form-control border-0 bg-light rounded-3',
}) => {
    const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [mentions, setMentions] = useState<Mention[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (onMentionsChange) onMentionsChange(mentions);
    }, [mentions, onMentionsChange]);

    // When value is cleared (e.g. after submit), clear mentions too
    useEffect(() => {
        if (!value) setMentions([]);
    }, [value]);

    const searchMentions = useCallback(async (query: string) => {
        if (query.length < 2) {
            setMentionUsers([]);
            setShowDropdown(false);
            return;
        }

        try {
            const res = await fetch(`/api/feed/mentions?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const users = await res.json();
                setMentionUsers(users);
                setShowDropdown(users.length > 0);
            }
        } catch {
            setShowDropdown(false);
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Check for @mention trigger
        const textarea = textareaRef.current;
        const cursorPos = textarea?.selectionStart ?? newValue.length;
        const textBeforeCursor = newValue.slice(0, cursorPos);
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

        if (mentionMatch) {
            const query = mentionMatch[1];

            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => searchMentions(query), 300);
        } else {
            setShowDropdown(false);
            setMentionUsers([]);
        }

        // Remove any mentions whose display text no longer appears in the value
        setMentions(prev => prev.filter(m => newValue.includes(m.displayText)));
    };

    const handleSelectUser = (user: MentionUser) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const cursorPos = textarea.selectionStart || 0;
        const textBeforeCursor = value.slice(0, cursorPos);
        const textAfterCursor = value.slice(cursorPos);

        // Replace the @query with a clean display name
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
        if (!mentionMatch) return;

        const beforeMention = textBeforeCursor.slice(0, mentionMatch.index);
        const displayName = `@${user.firstname} ${user.lastname}`;
        const newValue = `${beforeMention}${displayName} ${textAfterCursor}`;

        // Track this mention
        const mention: Mention = {
            displayText: displayName,
            userId: user.id,
            name: `${user.firstname} ${user.lastname}`,
        };
        setMentions(prev => {
            // Avoid duplicates
            if (prev.some(m => m.userId === user.id)) return prev;
            return [...prev, mention];
        });

        onChange(newValue);
        setShowDropdown(false);
        setMentionUsers([]);

        // Restore focus
        setTimeout(() => {
            if (textarea) {
                const newCursorPos = beforeMention.length + displayName.length + 1;
                textarea.focus();
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    return (
        <div className="position-relative">
            <textarea
                ref={textareaRef}
                className={className}
                rows={rows}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                maxLength={maxLength}
                disabled={disabled}
                style={{ resize: 'none' }}
            />

            <UserMentionDropdown
                users={mentionUsers}
                onSelect={handleSelectUser}
                visible={showDropdown}
            />
        </div>
    );
};

/**
 * Convert display text + mentions list into tokenised format for storage.
 * e.g. "Hello @Jane Smith" + mention {displayText: "@Jane Smith", userId: "u1", name: "Jane Smith"}
 * → "Hello @[Jane Smith](u1)"
 */
function tokenise(displayValue: string, mentions: Mention[]): string {
    let result = displayValue;
    // Sort by length descending to avoid partial replacement issues
    const sorted = [...mentions].sort((a, b) => b.displayText.length - a.displayText.length);
    for (const m of sorted) {
        result = result.replaceAll(m.displayText, `@[${m.name}](${m.userId})`);
    }
    return result;
}

export { tokenise };
export type { Mention };
export default MentionInput;
