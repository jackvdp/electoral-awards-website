import searchUsers from 'backend/use_cases/feed/searchUsers';

// Mock the supabase admin client
jest.mock('backend/supabase/admin', () => {
    const mockFrom = jest.fn();
    return {
        __esModule: true,
        default: { from: mockFrom },
        __mockFrom: mockFrom,
    };
});

const { __mockFrom: mockFrom } = require('backend/supabase/admin');

const mockSelect = jest.fn();
const mockIlike = jest.fn();
const mockLimit = jest.fn();

describe('searchUsers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFrom.mockReturnValue({ select: mockSelect });
        mockSelect.mockReturnValue({ or: mockIlike });
        mockIlike.mockReturnValue({ limit: mockLimit });
    });

    it('should return an empty array if query is too short', async () => {
        const result = await searchUsers('a');
        expect(result).toEqual([]);
        expect(mockFrom).not.toHaveBeenCalled();
    });

    it('should return an empty array if query is empty', async () => {
        const result = await searchUsers('');
        expect(result).toEqual([]);
    });

    it('should query supabase users table with the search term', async () => {
        const mockUsers = [
            { id: 'u1', firstname: 'Jane', lastname: 'Smith', organisation: 'EC', profile_image: '' },
        ];
        mockLimit.mockResolvedValue({ data: mockUsers, error: null });

        const result = await searchUsers('Jane');

        expect(mockFrom).toHaveBeenCalledWith('users');
        expect(mockSelect).toHaveBeenCalledWith('id, firstname, lastname, organisation, profile_image');
        expect(mockIlike).toHaveBeenCalledWith(
            'firstname.ilike.%Jane%,lastname.ilike.%Jane%'
        );
        expect(mockLimit).toHaveBeenCalledWith(8);
        expect(result).toEqual(mockUsers);
    });

    it('should return an empty array on supabase error', async () => {
        mockLimit.mockResolvedValue({ data: null, error: { message: 'DB error' } });

        const result = await searchUsers('Jane');
        expect(result).toEqual([]);
    });

    it('should respect a custom limit', async () => {
        mockLimit.mockResolvedValue({ data: [], error: null });

        await searchUsers('Jane', 5);
        expect(mockLimit).toHaveBeenCalledWith(5);
    });
});
