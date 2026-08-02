'use client'

import SearchBar from '@/components/ui/SearchBar';
import CryptoBackground from '@/components/CryptoBackground';
import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();

	function handleSearch(address: string) {
		if (address) {
			router.push(`/token/${address}`);
		}
	}

	return (
		<div className='relative flex flex-col gap-8 items-center justify-center w-full h-120'>
			<h1 className='text-center text-xl font-mono tracking-tighter sm:text-3xl'>
				Search your Meme Coin
			</h1>
			<CryptoBackground />

			<div className='w-150'>
				<SearchBar onSearch={handleSearch}/>
			</div>
		</div>
	)
}