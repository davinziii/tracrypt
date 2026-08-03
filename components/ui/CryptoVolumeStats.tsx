import { formatCompactNumber } from "@/utils/formatters";
import { useState } from "react";
import { usePriceHistory, MAX_POINTS, POLL_INTERVAL_MS } from "@/hooks/usePriceHistory";
import Sparkline from "./Sparklines";

type StatItem = {
    label: number | string;
    volume: number;
	txnsBuy: number;
	txnsSell: number;
	priceChange: number | string;
};

type CryptoVolumeStatsProps = {
  	dataStats: StatItem[]; 
    symbol: string;
    name: string;
    priceUsd: number | string;
};

export default function CryptoVolumeStats({dataStats, symbol, name, priceUsd}: CryptoVolumeStatsProps) {
	const [selectedLabel, setSelectedLabel] = useState(dataStats[0]?.label);
	const selectedStat = dataStats.find((d) => d.label === selectedLabel) ?? dataStats[0];

	const { txnsBuy: buyCount, txnsSell: sellCount } = selectedStat;
	const totalTxns = buyCount + sellCount;
	const buyPercent = totalTxns > 0 ? (buyCount / totalTxns) * 100 : 0;
	const sellPercent = buyPercent === 0 ? 0 : 100 - buyPercent;
    const priceHistory = usePriceHistory(priceUsd ? Number(priceUsd) : undefined);

	const totalMs = MAX_POINTS * POLL_INTERVAL_MS;
	const totalMinutes = Math.round(totalMs / 60000);

	const timeframeLabel =
		totalMinutes < 60
			? `${totalMinutes}m`
			: `${(totalMinutes / 60).toFixed(totalMinutes % 60 === 0 ? 0 : 1)}h`;

	return (
		<div className="grid grid-cols-4 gap-3 text-center">
			<div className="flex items-center col-span-4 gap-2 rounded-xl">
				<div className="flex items-center gap-2">
					<div>
						<h1 className="font-semibold font-sans text-2xl tracking-tight">{symbol}</h1>
						<p className="text-xs uppercase tracking-tight font-mono text-zinc-500">{name}</p>
					</div>
					<div className="flex flex-col ml-auto">
						<Sparkline data={priceHistory} />
						<p className="text-[10px] mt-2font-mono text-zinc-500">Last {timeframeLabel}</p>
					</div>
				</div>
			</div>
			{dataStats.map((data) => (
			<button onClick={() => setSelectedLabel(data.label)} key={data.label} className={`col-span-2 rounded-xl uppercase font-mono p-3 border cursor-pointer transition-colors hover:bg-zinc-600/30
				md:col-span-1 lg:col-span-2
				${selectedLabel === data.label ? "border border-emerald-400" : "border-zinc-700"}`}>
				<p className="font-mono text-[10px] tracking-tight uppercase text-zinc-400">{data.label} </p>
				<div className="flex flex-col items-center justify-center xl:flex-row">
					<p className="text-md font-medium text-zinc-200">
					{formatCompactNumber(data.volume)} 
					</p>
					<span className={`ml-2 text-[10px] tracking-tighter ${Number(data.priceChange) < 0 ? "text-red-400" : "text-emerald-400"}`}>{data.priceChange}%</span>
				</div>
			</button>
			))}
			<div className="col-span-4 p-4 border uppercase rounded-xl border-zinc-700">
				<div className="grid grid-cols-2 mb-4 justify-between text-xs font-mono text-zinc-400">
					<span className="">Buy/sell ratio <br></br> ({selectedLabel})</span>
					<div className="flex items-center justify-center">
						<span className="grid grid-cols-2 gap-2 w-fit h-8">
							<span className="flex flex-col gap-1 uppercase font-mono text-left">
								<span>Buy</span>
								<span>Sell</span>
							</span>
							<span className="flex flex-col relative gap-1 uppercase font-mono text-right text-md">
								<span className={`transition-all
								${buyPercent > sellPercent ? "animate-bounce-text text-emerald-300" : "text-emerald-400"}`}>
								{buyCount}
								</span>
								<span className={`transition-all
								${sellPercent > buyPercent ? "animate-bounce-text text-red-400": "text-red-400"}`}>
								{sellCount}
								</span>
							</span>
						</span>
					</div>
				</div>
				<div className="flex h-2 overflow-hidden rounded">
					<div className="bg-green-600" style={{ width: `${buyPercent}%` }}/>
					<div className="bg-red-500" style={{ width: `${sellPercent}%` }}/>
					{sellPercent === 0 && buyPercent === 0 ? <div className="bg-zinc-400 w-full"/> : null}
				</div>
			</div>
			
		</div>
	);
}