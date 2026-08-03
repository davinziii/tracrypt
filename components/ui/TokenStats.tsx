import { formatSmallPrice } from "@/utils/formatters";

type TokenStatsProps = {
    priceUsd: number | string;
    priceNative: number | string;
    marketCap: number | string;
    fdv: number | string;
    symbol: string;
}

export default function TokenStats({priceUsd, priceNative, marketCap, fdv, symbol}: TokenStatsProps) {

    const stats = [
        { name: "Price USD", price: priceUsd, currency: "USD"},
        { name: "Price", price: priceNative, currency: symbol},
        { name: "Market Cap", price: marketCap, currency: "USD"},
        { name: "FDV", price: fdv, currency: "USD"}
    ]

    return (
        <div className="grid grid-cols-4 border border-zinc-700 rounded-xl text-zinc-200 
            divide-zinc-700 overflow-hidden 
            md:divide-y md:divide-x md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
            <div key={stat.name} className="flex flex-col items-center justify-center p-3 text-center md:p-5">
                <h2 className="font-mono text-[8px] tracking-tight uppercase text-zinc-400 md:text-xs">
                    {stat.name}
                </h2>
                <p className="font-mono font-semibold text-xs md:text-xl lg:text-2xl tracking-tight">
                    {formatSmallPrice(stat.price)}
                    <span className="text-[8px] ml-1 text-zinc-500 font-normal md:text-xs">
                    {stat.currency}
                    </span>
                </p>
            </div>
        ))}
        </div>
    );
}