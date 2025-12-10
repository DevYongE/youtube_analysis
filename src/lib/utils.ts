import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(num: string | number) {
    const n = Number(num);
    if (isNaN(n)) return '0';
    return new Intl.NumberFormat('ko-KR', { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatDuration(isoDuration: string) {
    // Simple parser for PT1H2M10S format
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "00:00";

    const h = (match[1] || '').replace('H', '');
    const m = (match[2] || '').replace('M', '');
    const s = (match[3] || '').replace('S', '');

    const parts = [];
    if (h) parts.push(h.padStart(2, '0'));
    parts.push((m || '0').padStart(2, '0'));
    parts.push((s || '0').padStart(2, '0'));

    return parts.join(':');
}
