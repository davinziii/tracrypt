import Image, { StaticImageData } from "next/image";
import CopyButton from "@/components/ui/CopyButton";

type HeaderProfileProps = {
	profileImage: string;
	tokenAddress: string;
	accountAddress: string;
	truncatedTokenAddress: string;
	linksToken: {
		name: string;
		image: StaticImageData;
		url: string;
	}[];
	linksSocial: {
		name: string;
		image: StaticImageData;
		url: string;
		invert: boolean;
	}[];
	symbol: string;
	name: string;
}

export default function HeaderProfile({profileImage, tokenAddress, accountAddress, truncatedTokenAddress, linksToken, linksSocial, symbol, name}: HeaderProfileProps) {
	
	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
				<div className="flex items-center gap-2 h-25">
					<img src={profileImage} alt="Token Logo" className="aspect-square h-full rounded-xl object-cover"/>
					{/* Name and Symbol of Memecoin */}
					<div className="flex flex-col justify-between h-full w-full">
						<div className="flex gap-2">
							<div>
								<h1 className="font-semibold font-sans text-2xl tracking-tight">{symbol}</h1>
								<p className="text-xs uppercase tracking-tight font-mono text-zinc-500">{name}</p>
							</div>
							<CopyButton value={tokenAddress} truncatedAddress={truncatedTokenAddress} />
						</div>

						{/* Social Medias */}
						<div className="flex items-center gap-2 bg-zinc-300">
							{linksSocial.map((social) => (
								<a key={social.name} 
								href={social.url ? `${social.url}${accountAddress}` : undefined}
								target={social.url ? "_blank" : undefined}
								rel={social.url ? "noreferrer" : undefined}
								className="flex items-center justify-center py-3 px-3.5 gap-2 w-12 rounded-xl border-zinc-800 border transition-colors hover:bg-zinc-800">
									<Image src={social.image} alt="solscanlogo" className={`w-3.5 h-3.5 shrink-0 ${social.invert ? "invert" : ""}`}/>
								</a>
							))}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 xl:col-span-1">
					{linksToken.map((link) => (
						<a key={link.name} 
						href={`${link.url}${tokenAddress}`} 
						target="_blank"
						rel="noreferrer"
						className="flex items-center justify-center py-3 gap-2 rounded-xl border-zinc-800 border transition-colors hover:bg-zinc-800">
							<Image src={link.image} alt="" className="w-3.5 h-3.5"/>
							<p className="text-xs font-sans font-extralight tracking-tight opacity-80">{link.name}</p>
						</a>
					))}
				</div>
			</div>
		</div>
	)
}