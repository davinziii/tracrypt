import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import SearchResults from "./SearchResults";
import { formatCompactNumber, getTokenAge, formatSmallPrice } from "@/utils/formatters";
import Link from "next/link";

type SearchBarProps = {
    onSearch: (address: string) => void
}

interface DexScreenerToken {
    address: string
    symbol: string
    name: string
}

interface DexScreenerPair {
    chainId: string
    baseToken: DexScreenerToken
    priceUsd?: string
    marketCap?: number
    volume?: { h24?: number }
    priceChange?: { h24?: number }
    pairCreatedAt?: number
    info?: { imageUrl?: string }
    liquidity?: { usd?: number }
}

export default function SearchBar({onSearch}: SearchBarProps) {
    const [inputValue, setInputValue] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState<DexScreenerPair[]>([])


    const modalRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const isValidSolanaAddress = (value: string): boolean => {
        const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

        return base58Regex.test(value)
    }

    const getRelevanceScore = (pair: DexScreenerPair, query: string): number => {
        const symbol = pair?.baseToken?.symbol?.toLowerCase() ?? ''
        const name = pair?.baseToken?.name?.toLowerCase() ?? ''
        const q = query.toLowerCase()

        if (symbol === q) return 3          // exact symbol match — best
        if (name === q) return 3            // exact name match — best
        if (symbol.startsWith(q)) return 2  // symbol starts with query
        if (name.startsWith(q)) return 2    // name starts with query
        if (symbol.includes(q) || name.includes(q)) return 1  // contains query somewhere
        return 0
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setOpenModal(false)
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setOpenModal(false)
            }
        }

        if (openModal) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleEscape)
            inputRef.current?.focus()
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [openModal])

    useEffect(() => {
        const query = inputValue.trim()

        if (!query) {
            setSuggestions([])
            return
        }

        setLoadingSuggestions(true)

        const timeoutId = setTimeout(async () => {
            try {
                const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`)
                if (!res.ok) {
                    setSuggestions([])
                    return
                }

                const data = await res.json()
                const solanaPairs: DexScreenerPair[] = data?.pairs?.filter((pair: DexScreenerPair) => pair.chainId === 'solana') ?? []

                // Dedupe by token address, keeping the pair with the highest market cap for each token
                const dedupedMap = new Map<string, DexScreenerPair>()
                for (const pair of solanaPairs) {
                    const tokenAddress = pair?.baseToken?.address
                    if (!tokenAddress) continue

                    const existing = dedupedMap.get(tokenAddress)
                    const currentLiquidity = pair?.liquidity?.usd ?? 0
                    const existingLiquidity = existing?.liquidity?.usd ?? 0

                    if (!existing || currentLiquidity > existingLiquidity) {
                        dedupedMap.set(tokenAddress, pair)
                    }
                }

                // Sort by market cap, highest first
                const sorted = Array.from(dedupedMap.values()).sort((a, b) => {
                    const relevanceA = getRelevanceScore(a, query)
                    const relevanceB = getRelevanceScore(b, query)

                    if (relevanceB !== relevanceA) {
                        return relevanceB - relevanceA  // higher relevance first
                    }

                    // same relevance tier → sort by liquidity
                    const liquidityA = a?.liquidity?.usd ?? 0
                    const liquidityB = b?.liquidity?.usd ?? 0
                    return liquidityB - liquidityA
                })

                setSuggestions(sorted.slice(0, 8)) // cap at 8 after dedupe + sort
            } catch (err) {
                console.error('Failed to fetch suggestions:', err)
                setSuggestions([])
            } finally {
                setLoadingSuggestions(false)
            }
        }, 200)

        return () => clearTimeout(timeoutId)
    }, [inputValue])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const cleanAddress = inputValue.trim();
        
        if (isValidSolanaAddress(cleanAddress)) {
            onSearch(cleanAddress)
            setOpenModal(false)
        } else if (suggestions.length > 0) {
            // Not a valid address, but we have suggestions — use the top result
            const topSuggestion = suggestions[0]?.baseToken?.address

            if (topSuggestion) {
                onSearch(topSuggestion)
                setOpenModal(false)
            }
        }

    };

    return (
        <div  className="relative flex flex-col w-full h-full">
            <div onClick={() => setOpenModal(true)} className="
                flex justify-between 
                w-full h-10 px-3.5 py-2.5
                text-xs 
                border rounded-xl placeholder-[#50627c] border-zinc-700 outline-none
                transition-colors 
                focus:ring-1 focus:ring-emerald-500/90 hover:border hover:border-emerald-500/90">
                <div className="flex items-center w-full">
                    <CiSearch className="w-8 pr-2 mr-2 text-lg border-r border-r-zinc-500"/>
                    <input type="text" 
                    className="w-full outline-none bg-none font-mono" 
                    autoComplete="off"
                    placeholder="Search contract address, tame, or ticker" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)}/>
                    <button>Search</button>
                </div>
            </div>
            {/* Backdrop Blurr */}
            <div onClick={() => setOpenModal(false)} className={` inset-0 bg-black/30 backdrop-blur-sm z-40 ${openModal ? "fixed animate-overlay-in pointer-events-auto " : "animate-overlay-out pointer-events-none"}`} />
            {/* Modal */}
            <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Token search results" className={`
                absolute z-50 flex-col gap-1 w-full h-100 border border-zinc-700 bg-black rounded-2xl 
                transition-all duration-100 ease-in-out overflow-y-auto
                ${openModal ? "flex animate-overlay-in pointer-events-auto" : "animate-overlay-out pointer-events-none"}`}>
                <div className="sticky top-0 z-10 pt-5 px-5 bg-black">
                    <form onSubmit={(handleSubmit)} className="
                        flex justify-between 
                        w-full p-2 mb-2
                        text-xs 
                        border-b-2 border-zinc-800 placeholder-[#50627c] outline-none
                        transition-all rounded-xl
                        focus:ring-1 focus:ring-emerald-500/90 hover:border hover:border-zinc-500/40">
                        <div className="flex items-center w-full">
                            <CiSearch className="w-8 pr-2 mr-2 text-lg border-r border-r-zinc-500"/>
                            <input type="text" id="tokenAddress" 
                                ref={inputRef}
                                className="w-full outline-none bg-none" 
                                autoComplete="off"
                                placeholder="Search contract address, name, or ticker" 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)}/>
                            <button 
                                type="submit" 
                                disabled={!isValidSolanaAddress(inputValue.trim()) && suggestions.length === 0}>
                                Search
                            </button>
                        </div>
                    </form>
                </div>
                {/* Search Results */}
                {loadingSuggestions ? (
                <div className="flex items-center justify-center py-8 text-zinc-500 text-sm font-mono">
                    Searching...
                </div>
                ) : suggestions.length > 0 ? (
                    suggestions.map((suggest) => (
                        <Link  key={suggest?.baseToken?.address} 
                            href={`/token/${suggest?.baseToken?.address}`} 
                            onClick={() => setOpenModal(false)}>
                            <SearchResults 
                                image={suggest?.info?.imageUrl} 
                                name={suggest?.baseToken?.symbol} 
                                address={suggest?.baseToken?.address} 
                                priceChange={suggest?.priceChange?.h24 ?? 0}
                                data={{
                                    priceUsd: formatSmallPrice(suggest?.priceUsd ?? 0),
                                    marketCap: formatCompactNumber(Number(suggest?.marketCap)),
                                    volume: formatCompactNumber(Number(suggest?.volume?.h24)),
                                    tokenAge: getTokenAge(Number(suggest?.pairCreatedAt))
                                }} 
                            />
                        </Link>
                    ))
                ) : inputValue.trim() ? (
                    <div className="flex items-center justify-center py-8 text-zinc-500 text-sm font-mono">
                        No results found
                    </div>
                ) : 
                    <div className="flex items-center justify-center h-full p-5 text-center text-zinc-500 text-xl font-mono">
                        Search contract address, name, or ticker!
                    </div>
                }
            </div>
        </div>
    )
}