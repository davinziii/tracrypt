
type StatItem = {
    label: string;
    value: number | string ;
    isDanger: boolean;
    colSpan?: string; 
};

type CryptoStatsProps = {
    dataStats: StatItem[]; 
};

export default function CryptoStats({dataStats}: CryptoStatsProps) {


    return (
        <div className="grid grid-cols-3 grid-rows-4 gap-2 w-full rounded-xl">
            
            {dataStats.map((data) => (
                <div key={data.label}
                className={`flex flex-col items-center justify-center p-3 text-center rounded-xl border transition-colors 
                    ${ data.colSpan || "col-span-1"}
                    ${ data.isDanger ? "border-red-500/90 bg-red-900/30 text-red-400"
                    : "border-emerald-500/90 bg-emerald-900/30 text-emerald-400"}`}
                >
                <h2 className="mb-1 text-[10px] font-mono tracking-tight text-zinc-400 uppercase text-center">
                    {data.label}
                </h2>
                <p className={`font-mono font-semibold tracking-tight 
                    ${data.colSpan ? "text-xl" : "text-sm md:text-md"}`}>
                    {data.value}
                </p>
                </div>
            ))}
        </div>
    )
}