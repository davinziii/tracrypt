'use client'
import { TokenLinks } from "@/data/TokenLinks";
import { SocialLinks } from "@/data/SocialLinks";
import { useTokenData } from "../hooks/useTokenData";
import { formatCompactNumber, getTokenAge } from "@/utils/formatters";
import HeaderProfile from "@/components/ui/HeaderProfile";
import TokenStats from "@/components/ui/TokenStats";
import CryptoStats from "@/components/ui/CryptoStats";
import MarketChart from "./ui/MarketChart";
import SearchBar from "./ui/SearchBar";
import { useRouter, useParams } from 'next/navigation';
import CryptoVolumeStats from "./ui/CryptoVolumeStats";

const DEFAULT_TOKEN = "A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump";

export default function Dashboard() {
    const params = useParams();
    const router = useRouter();

    // 2. Read tokenAddress from URL parameter, fallback to default
    const tokenAddress = (params?.tokenAddress as string) || DEFAULT_TOKEN;
    const { loading, pairData, rugcheckData, dexPaid } = useTokenData(tokenAddress);
    const truncatedTokenAddress = `${tokenAddress.slice(0,4)}...${tokenAddress.slice(-4)}`

    const topTen = rugcheckData?.topHolders?.slice(2, 12).reduce((sum: number, h: any) => sum + (h?.pct || 0), 0);
    const devHoldings = `${(((rugcheckData?.creatorBalance ?? 0) / 1000000) / 1000000000)?.toFixed(2)}%`

    const rugcheckStats = [
        { label: "Liquidity", value: formatCompactNumber(pairData?.liquidity?.usd), isDanger: pairData?.liquidity?.usd < 4000, colSpan: "col-span-2" },
        { label: "Locked Liq.", value: `${rugcheckData?.markets?.[0]?.lp?.lpLockedPct.toFixed(2)}%`, isDanger: rugcheckData?.markets[0]?.lp?.lpLockedPct < 60},
        { label: "Top 1 Holder", value: `${rugcheckData?.topHolders?.[2]?.pct?.toFixed(2)}%`, isDanger: rugcheckData?.topHolders?.[2]?.pct >= 5 },
        { label: "Top 10 Holder", value: `${topTen?.toFixed(2)}%`, isDanger: topTen >= 20 },
        { label: "Holders", value: formatCompactNumber(rugcheckData?.totalHolders), isDanger: rugcheckData?.totalHolders <= 40 },
        { label: "Dev Holding", value: devHoldings, isDanger: (((rugcheckData?.creatorBalance ?? 0) / 1000000) / 1000000000) >= 1 },
        { label: "Mintable", value: rugcheckData?.mintAuthority === null ? "No" : "Yes", isDanger: rugcheckData?.mintAuthority === null ? false : true},
        { label: "Freezable", value: rugcheckData?.freezeAuthority === null ? "No" : "Yes", isDanger: rugcheckData?.freezeAuthority === null ? false : true },
        { label: "Token Age", value: getTokenAge(pairData?.pairCreatedAt), isDanger: Math.floor((Date.now() - pairData?.pairCreatedAt) / 1000)  < 86400 },
        { label: "Insiders", value: `${rugcheckData?.insiderNetworks === null ? 0 : rugcheckData?.insiderNetworks?.length}%`, isDanger: rugcheckData?.insiderNetworks === null ? false : rugcheckData?.insiderNetworks?.length > 5 },
        { label: "Dex Paid", value: dexPaid ? "Yes" : "No", isDanger: !dexPaid },
        ]

    const volumeStats = [
        { label: "Vol 5m", volume: pairData?.volume?.m5, txnsBuy: pairData?.txns?.m5?.buys, txnsSell: pairData?.txns?.m5?.sells, priceChange: pairData?.priceChange?.m5},
        { label: "Vol 1h", volume: pairData?.volume?.h1, txnsBuy: pairData?.txns?.h1?.buys, txnsSell: pairData?.txns?.h1?.sells, priceChange: pairData?.priceChange?.h1},
        { label: "Vol 6h", volume: pairData?.volume?.h6, txnsBuy: pairData?.txns?.h6?.buys, txnsSell: pairData?.txns?.h6?.sells, priceChange: pairData?.priceChange?.h6},
        { label: "Vol 24h", volume: pairData?.volume?.h24, txnsBuy: pairData?.txns?.h24?.buys, txnsSell: pairData?.txns?.h24?.sells, priceChange: pairData?.priceChange?.h24},
        ]    

    if (loading || !pairData || !rugcheckData) {
        return (
            <div className="flex items-center justify-center w-full h-screen text-white text-sm">
                Loading token details...
            </div>
        );
    }

    function handleSearch(address: string) {
        if (address) {
            router.push(`/token/${address}`);
        }
    }

    return (
        <div className="grid grid-cols-4 items-start w-full gap-4 p-5"> 
            <div className="grid grid-cols-1 col-span-4 w-full gap-4 md:grid-cols-2">
                <HeaderProfile 
                    profileImage={pairData?.info?.imageUrl} 
                    tokenAddress={tokenAddress} 
                    accountAddress={rugcheckData?.creator} 
                    truncatedTokenAddress={truncatedTokenAddress}
                    linksToken={TokenLinks} linksSocial={SocialLinks} 
                    symbol={pairData?.baseToken.symbol} 
                    name={pairData?.baseToken.name} />
                <TokenStats 
                    priceUsd={pairData?.priceUsd} 
                    priceNative={pairData?.priceNative} 
                    marketCap={formatCompactNumber(pairData?.marketCap)} 
                    fdv={formatCompactNumber(pairData?.fdv)} 
                    symbol="SOL"/>
            </div> 
            <div className="flex flex-col col-span-4 gap-4 lg:col-span-3">
                <SearchBar onSearch={handleSearch}/>
                <MarketChart tokenAddress={tokenAddress} />
            </div>
            <div className="grid flex-col col-span-4 gap-4 lg:col-span-1">
                <CryptoVolumeStats dataStats={volumeStats} symbol={pairData?.baseToken.symbol} name={pairData?.baseToken.name} priceUsd={pairData?.priceUsd} />
                <CryptoStats dataStats={rugcheckStats} />
            </div>
        </div>
    )
}