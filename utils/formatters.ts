// Format numbers putting K as thousands, and M as millions
export function formatCompactNumber(number: number | null | undefined) {
    if (number == null) return 0

    return new Intl.NumberFormat('en-us', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(number)
}

// Token Creation Date
export function getTokenAge(createdAtMs: number | null | undefined): string {
    if (!createdAtMs) return "N/A";

    const diffInSeconds = Math.floor((Date.now() - createdAtMs) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays}d ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths}mo ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y ago`;
}

// Number of zeros to raise to
export function formatSmallPrice(price: string | number) {
    const num = Number(price);

    if (isNaN(num)) return String(price);

    if (num > 0 && num < 0.001) {
        const str = num.toFixed(12).replace(/0+$/, "");
        const match = str.match(/^0\.(0+)(\d+)/);

        if (!match) return str;

        const zeros = match[1].length;
        const remaining = match[2];

        const superscripts = ["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹"];

        const zeroCount = String(zeros)
            .split("")
            .map((n) => superscripts[Number(n)])
            .join("");

        return `0.0${zeroCount}${remaining.slice(0, 2)}`;
    }

    if (num < 1) {
        return num.toFixed(4);
    }

    return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

}