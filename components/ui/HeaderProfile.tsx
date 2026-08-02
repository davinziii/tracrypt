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
                <div className="flex items-center gap-4 justify-center sm:justify-start">
                    <img src={profileImage}
                        alt="Token Logo"
                        className="aspect-square h-30 rounded-xl object-cover shrink-0"
                    />
                    {/* Name and Symbol of Memecoin */}
                    <div className="flex flex-col items-start gap-2">
                        <div>
                            <h1 className="flex font-semibold font-sans text-2xl tracking-tight">
                                {symbol}
                            </h1>
                            <p className="text-xs uppercase tracking-tight font-mono text-zinc-500">
                                {name}
                            </p>
                            <div className="flex ">
                                <p className="mt-3 text-[10px] uppercase tracking-tight font-mono text-zinc-500 md:text-xs">{truncatedTokenAddress}</p>
                                <CopyButton value={tokenAddress} truncatedAddress={truncatedTokenAddress} />
                            </div>
                        </div>
                        
                        {/* Social Medias */}
                        <div className="flex items-center gap-x-2">
                            {linksSocial.map((social) => (
                                <a key={social.name}
                                href={social.url ? `${social.url}${accountAddress}` : undefined}
                                target={social.url ? "_blank" : undefined}
                                rel={social.url ? "noreferrer" : undefined}
                                className="flex items-center justify-center p-2 shrink-0 transition-colors hover:bg-zinc-800
                                sm:p-1 sm:rounded-full sm:border-zinc-800 sm:border">
                                <Image
                                src={social.image}
                                alt={`${social.name} logo`}
                                className={`w-4 h-full shrink-0 ${social.invert ? "invert" : ""} sm:w-3`}
                                />
                            </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-1 xl:col-span-1 md:gap-4">
                    {linksToken.map((link) => (
                        <a key={link.name} 
                        href={`${link.url}${tokenAddress}`} 
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center py-3 gap-2 rounded-xl border-zinc-800 border transition-colors hover:bg-zinc-800">
                            <Image src={link.image} alt="" className="w-3 h-3"/>
                            <p className="text-[10px] font-sans font-extralight tracking-tight opacity-80 md:text-xs">{link.name}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}