import { formatCompactNumber } from "@/utils/formatters";
import { useState } from "react";

type StatItem = {
    label: number | string;
    volume: number;
	txnsBuy: number;
	txnsSell: number;
	priceChange: number | string;
};

type CryptoVolumeStatsProps = {
  dataStats: StatItem[]; 
};

export default function CryptoVolumeStats({dataStats}: CryptoVolumeStatsProps) {
	const [selectedLabel, setSelectedLabel] = useState(dataStats[0]?.label);
	const selectedStat = dataStats.find((d) => d.label === selectedLabel) ?? dataStats[0];

	const { txnsBuy: buyCount, txnsSell: sellCount } = selectedStat;
	const totalTxns = buyCount + sellCount;
	const buyPercent = totalTxns > 0 ? (buyCount / totalTxns) * 100 : 0;
	const sellPercent = buyPercent === 0 ? 0 : 100 - buyPercent;

	return (
		<div className="grid grid-cols-4 gap-3 text-center">
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
						<span className="flex flex-col text-left w-fit">
							<span className="relative">
								buy
								<span className={`absolute -right-6 inline-block transition-all 
								${buyPercent <= sellPercent && String(buyCount).length >= 4 ? "left-8" : ""}
								${buyPercent > sellPercent ? "animate-bounce-text -top-2 -right-13 text-emerald-300 text-lg": "text-emerald-400"} 
								${buyPercent > sellPercent && String(buyCount).length <= 2 ? "left-10": buyPercent > sellPercent && String(buyCount).length <= 3 ? "left-9" : ""}`}>
								{buyCount}
								</span>
							</span>
							<span className="relative mt-2">
								sell
								<span className={`absolute -right-7 inline-block transition-all 
								${sellPercent <= buyPercent && String(sellCount).length >= 4 ? "left-9" : ""}
								${sellPercent > buyPercent ? "animate-bounce-text -top-2 left-10 text-red-400 text-lg": "text-red-400"}
								${sellPercent > buyPercent && String(sellCount).length <= 2 ? "left-10": sellPercent > buyPercent && String(sellCount).length <= 3 ? "left-9" : ""}`}>
								{sellCount}
								</span>
							</span>
						</span>
					</div>
				</div>
				<div className="flex h-2 overflow-hidden rounded">
					<div className="bg-green-600" style={{ width: `${buyPercent}%` }}/>
					<div className="bg-red-500" style={{ width: `${sellPercent}%` }}/>
					{sellPercent === 0 ? <div className="bg-zinc-400 w-full"/> : null}
				</div>
			</div>
			
		</div>
	);
}