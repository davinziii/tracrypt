
type MarketChartPros = {
    tokenAddress: string;
}

export default function MarketChart({tokenAddress}: MarketChartPros) {
    
    return (
        <div className="rounded-xl overflow-hidden">
            <iframe
                src={`https://dexscreener.com/solana/${tokenAddress}?embed=1&theme=dark&trades=0&info=0`}
                className="w-full min-h-120 sm:h-140 md:h-150"
                title={`Chart for ${tokenAddress}`}
                loading="lazy"
            />
        </div>
    )
}