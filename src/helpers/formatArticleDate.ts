function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

export default function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate();
    const year = date.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const month = monthNames[date.getMonth()];

    const ordinal = getOrdinalSuffix(day);

    return `${day}${ordinal} ${month}, ${year}`;
}