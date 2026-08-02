// app/page.tsx
'use client'

import SearchBar from '@/components/ui/SearchBar';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

const DEFAULT_TOKEN = "A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump";

export default function Home() {
	// Automatically redirects '/' to '/token/A8C3xuq...'
	// redirect(`/token/${DEFAULT_TOKEN}`);
	const router = useRouter();

	function handleSearch(address: string) {
		if (address) {
			router.push(`/token/${address}`);
		}
	}

	return (
		<div className='flex items-center justify-center w-full h-120'>
			<div className='w-150'>
				<SearchBar onSearch={handleSearch}/>
			</div>
		</div>
	)
}
