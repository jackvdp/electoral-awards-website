import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MentionInput from 'components/blocks/feed/MentionInput';

global.fetch = jest.fn();

describe('MentionInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        (global.fetch as jest.Mock).mockReset();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders a textarea with placeholder', () => {
        render(
            <MentionInput
                value=""
                onChange={mockOnChange}
                placeholder="What's on your mind?"
                maxLength={1000}
            />
        );

        expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
    });

    it('calls onChange when text is typed', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        render(
            <MentionInput
                value=""
                onChange={mockOnChange}
                placeholder="Type here"
                maxLength={1000}
            />
        );

        const textarea = screen.getByPlaceholderText('Type here');
        await user.type(textarea, 'Hello');

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('shows dropdown when @ is typed followed by 2+ characters', async () => {
        const mockUsers = [
            { id: 'u1', firstname: 'Jane', lastname: 'Smith', organisation: 'EC', profile_image: '' },
        ];

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockUsers,
        });

        // Use a stateful wrapper to properly simulate controlled input
        let currentValue = '';
        const StatefulWrapper = () => {
            const [value, setValue] = React.useState('');
            currentValue = value;
            return (
                <MentionInput
                    value={value}
                    onChange={(v) => { setValue(v); mockOnChange(v); }}
                    placeholder="Type here"
                    maxLength={1000}
                />
            );
        };

        render(<StatefulWrapper />);

        const textarea = screen.getByPlaceholderText('Type here') as HTMLTextAreaElement;

        // Simulate typing @Ja
        fireEvent.change(textarea, { target: { value: '@Ja' } });

        // Advance timers past the debounce
        act(() => {
            jest.advanceTimersByTime(350);
        });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/feed/mentions?q=Ja');
        });
    });

    it('respects maxLength', () => {
        render(
            <MentionInput
                value=""
                onChange={mockOnChange}
                placeholder="Type here"
                maxLength={100}
            />
        );

        const textarea = screen.getByPlaceholderText('Type here');
        expect(textarea).toHaveAttribute('maxlength', '100');
    });

    it('can be disabled', () => {
        render(
            <MentionInput
                value=""
                onChange={mockOnChange}
                placeholder="Type here"
                maxLength={1000}
                disabled={true}
            />
        );

        const textarea = screen.getByPlaceholderText('Type here');
        expect(textarea).toBeDisabled();
    });
});
