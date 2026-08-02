import Image from "next/image"
import solanalogo from '../../public/logo/solana.png'
import placeholder from '../../public/logo/placeholder.png'
import CopyButton from "./CopyButton";

type SearchResultsProps = {
    image?: string;
    name: string;
    address: string;
    priceChange: number;
    data: {
        priceUsd: number | string;
        marketCap: number | string;
        volume: number | string;
        tokenAge: number | string;
    };
}

export default function SearchResults({image, name, address, priceChange, data}: SearchResultsProps) {
    const truncatedTokenAddress = `${address.slice(0,4)}...${address.slice(-4)}`
    const upDown = priceChange > 0 ? <span className="text-green-500">{priceChange}%</span> : priceChange < 0 ? <span className="text-red-500">{priceChange}%</span> : <span className="text-zinc-500">0%</span>
    const labels = {
        priceUsd: "PRICE USD",
        marketCap: "MARKET CAP",
        volume: "VOLUME 24H",
        tokenAge: "TOKEN AGE",
    }

    return (
        <div className="flex flex-col px-5">
            <div className="grid grid-cols-3 gap-2 w-full p-1.5 border-b border-zinc-500 overflow-hidden">
                <div className="col-span-3 flex items-center justify-center sm:col-span-1 sm:justify-start">
                    <div className="relative w-12 border rounded-lg border-zinc-500/50 overflow-hidden">
                        <Image src={solanalogo} alt="solana" className="absolute -bottom-0.5 -left-0.5 border border-zinc-500 w-5 bg-black rounded-full"/>
                        {image ? (
                            <Image 
                            src={image} 
                            alt="Token Profile" 
                            width={48} 
                            height={48} 
                            className="z-1 object-cover" />
                        ) : (
                            <Image 
                            src={placeholder} 
                            alt="Token Profile" 
                            width={48} 
                            height={48} 
                            className="z-1 object-cover" />
                        )}
                    </div>
                    <div className="font-mono ml-2">
                        <p className="">{name}</p>
                        <p className="flex items-center text-[10px] text-zinc-400">{truncatedTokenAddress}
                            <span onClick={(e) => e.stopPropagation()}>
                                <CopyButton value={address} truncatedAddress={truncatedTokenAddress}/>
                            </span>
                        </p>
                    </div>
                </div>
                <div className="col-span-3 grid grid-cols-2 items-center gap-2 font-mono md:grid-cols-4 sm:col-span-2 sm:gap-4">
                    <div className="flex flex-col text-center md:text-left">
                        <p className="font-light tracking-tighter text-zinc-400 text-[10px]">{labels.priceUsd}&nbsp;{upDown}</p>
                        <p className="tracking-tighter text-xs">${data.priceUsd}</p>
                    </div>
                    <div className="flex flex-col text-center md:text-left">
                        <p className="font-light tracking-tighter text-zinc-400 text-[10px]">{labels.marketCap}&nbsp;</p>
                        <p className="tracking-tighter text-xs">${data.marketCap}</p>
                    </div>
                    <div className="flex flex-col text-center md:text-left">
                        <p className="font-light tracking-tighter text-zinc-400 text-[10px]">{labels.volume}&nbsp;</p>
                        <p className="tracking-tighter text-xs">${data.volume}</p>
                    </div>
                    <div className="flex flex-col text-center md:text-left">
                        <p className="font-light tracking-tighter text-zinc-400 text-[10px]">{labels.tokenAge}&nbsp;</p>
                        <p className="tracking-tighter text-xs">{data.tokenAge}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}