function getRelativeTime(daysAgo: number): string {
    if (daysAgo === 0) return "今日";
    if (daysAgo === 1) return "昨日";
    if (daysAgo === 2) return "一昨日";
    if (daysAgo < 7) return `${daysAgo}日前`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)}週間前`;

    return "1ヶ月以上前";
}

export default getRelativeTime;
