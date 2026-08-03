// hooks/usePriceHistory.ts
import { useEffect, useRef, useState } from "react";

export const MAX_POINTS = 30;
export const POLL_INTERVAL_MS = 10_000; 

export function usePriceHistory(priceUsd: number | undefined) {
    const [history, setHistory] = useState<number[]>([]);
    const lastPrice = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (priceUsd === undefined) return;
        if (priceUsd === lastPrice.current) return;

        lastPrice.current = priceUsd;

        setHistory((prev) => {
        const next = [...prev, priceUsd];
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
        });
    }, [priceUsd]);

    return history;
}