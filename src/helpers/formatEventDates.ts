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
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    };

    // Helper function to format time as "14:00"
    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Check if the start and end dates are on the same day
    const isSameDay = startDate.toDateString() === endDate.toDateString();

    if (isSameDay) {
        // If the dates are on the same day, format as "31 Jan 24, 14:00 – 16:00"
        return `${formatDate(startDate)}, ${formatTime(startDate)} – ${formatTime(endDate)}`;
    } else {
        // If the dates are on different days, format as "31 Jan 24 - 1 Feb 24"
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
}
