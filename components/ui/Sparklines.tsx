// components/ui/Sparkline.tsx
type SparklineProps = {
    data: number[];
    width?: number;
    height?: number;
};

export default function Sparkline({ data, width = 72, height = 24 }: SparklineProps) {
    if (data.length < 2) {
        return <svg width={width} height={height} />; // not enough data yet
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // avoid divide-by-zero if price hasn't moved at all

    const points = data
        .map((value, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
        })
        .join(" ");

    const isUp = data[data.length - 1] >= data[0];
    const color = isUp ? "#639922" : "#E24B4A"; // green / red, matches your buy/sell bar

    return (
        <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={isUp ? "Price trending up" : "Price trending down"}
        >
        <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        </svg>
    );
}