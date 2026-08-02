'use client'

import { useEffect, useState } from "react";

export function useTokenData(tokenAddress: string) {
    const [loading, setLoading] = useState(true)
    const [pairData, setPairData] = useState<any>(null)
    const [rugcheckData, setRugcheckData] = useState<any>(null)
    const [dexPaid, setDexPaid] = useState(false)


    useEffect(() => {
        if (!tokenAddress) return

        let cancelled = false
        const localFetchingRef = { current: false }

        async function fetchTokenData(isFirstLoad: boolean) {
            if (localFetchingRef.current) return // skip if previous fetch still in flight
            localFetchingRef.current = true

            try {
                if (isFirstLoad) setLoading(true)

                const [dexRes, rugRes] = await Promise.all([
                    fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`),
                    fetch(`https://api.rugcheck.xyz/v1/tokens/${tokenAddress}/report`),
                ])

                const dexData = await dexRes.json()
                let chainId: string | null = null
                
                if (cancelled) return

                if (dexData.pairs && dexData.pairs.length > 0) {
                    chainId = dexData.pairs[0].chainId
                    setPairData(dexData.pairs[0])
                } else {
                    setPairData(null)
                }

                if (chainId) {
                    try {
                        const dexPaidRes = await fetch(
                            `https://api.dexscreener.com/orders/v1/${chainId}/${tokenAddress}`
                        )

                        if (dexPaidRes.ok) {
                            const data = await dexPaidRes.json()
                            const rawOrders = Array.isArray(data) ? data : data?.orders
                            const isPaid = Array.isArray(rawOrders) && rawOrders.some(
                                (order: any) => order.status === 'approved'
                            )
                            if (!cancelled) setDexPaid(isPaid)
                        } else {
                            if (!cancelled) setDexPaid(false)
                        }
                    } catch (err) {
                        console.error('Failed to fetch DEX orders:', err)
                        if (!cancelled) setDexPaid(false)
                    }
                } else {
                    if (!cancelled) setDexPaid(false)
                }

                if (rugRes.ok) {
                    const rugData = await rugRes.json()
                    if (!cancelled) setRugcheckData(rugData)
                } else {
                    if (!cancelled) setRugcheckData(null)
                }

            } catch (error) {
                console.error('Failed to fetch token details:', error)
                if (!cancelled) {
                    setPairData(null)
                    setRugcheckData(null)
                }
            } finally {
                localFetchingRef.current = false
                if (isFirstLoad && !cancelled) setLoading(false)
            }
        }

        fetchTokenData(true) // initial load with loading state
        const intervalId = setInterval(() => fetchTokenData(false), 2000)

        return () => {
            cancelled = true
            clearInterval(intervalId)
        }
    }, [tokenAddress])

    return { loading, pairData, rugcheckData, dexPaid }
}