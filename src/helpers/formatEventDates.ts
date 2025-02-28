export default function formatEventDates(startDateInput: Date | string, endDateInput: Date | string): string {
    // Ensure inputs are Date objects
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    // Validate the date objects
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'Invalid dates provided';
    }

    // Helper function to format a date as "31 Jan 24"
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'});
    };

    // Helper function to format time as "14:00"
    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: false});
    };

    // Get friendly timezone name and offset
    const getTimezoneInfo = (): string => {
        // Get UTC offset
        const offset = startDate.getTimezoneOffset();
        const hours = Math.abs(Math.floor(offset / 60));
        const minutes = Math.abs(offset % 60);
        const sign = offset == 0 ? '+' : offset < 0 ? '+' : '-';
        const utcString = offset == 0 ?
            'UTC' :
            `UTC${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}`;

        // Get timezone abbreviation using Intl.DateTimeFormat
        try {
            // This gets the time zone name from the browser's locale
            const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

            // Try to get the short timezone code (e.g., PST, EST)
            const shortCode = new Intl.DateTimeFormat('en', {
                timeZoneName: 'short',
                timeZone: timeZoneName
            }).formatToParts(startDate)
                .find(part => part.type === 'timeZoneName')?.value || '';

            // If we have a shortCode, return it with the UTC offset
            if (shortCode && shortCode.length <= 5) {
                return `${shortCode} / ${utcString}`;
            }

            // If the time zone is too long or unavailable, just return the UTC offset
            return utcString;
        } catch (e) {
            // Fallback to just the UTC offset if there's an error
            return utcString;
        }
    };

    // Check if the start and end dates are on the same day
    const isSameDay = startDate.toDateString() === endDate.toDateString();

    if (isSameDay) {
        // If the dates are on the same day, format as "31 Jan 24, 14:00 – 16:00 (PST, UTC-8)"
        const timezone = getTimezoneInfo();
        return `${formatDate(startDate)}, ${formatTime(startDate)} – ${formatTime(endDate)} (${timezone})`;
    } else {
        // If the dates are on different days, format as "31 Jan 24 - 1 Feb 24"
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
}