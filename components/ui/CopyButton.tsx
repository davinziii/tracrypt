import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopyButtonProps = {
    value: string;
    truncatedAddress: string;
}

export default function CopyButton({value, truncatedAddress}: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button onClick={handleCopy} className="flex items-center justify-center px-1 gap-2 rounded-xl 
            transition-colors cursor-pointer
            hover:text-white hover:bg-zinc-900">
            <div
                className="p-1.5  rounded-lg text-zinc-400 transition-colors active:scale-95"
                title="Copy Address">
                {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                <Copy className="w-3 h-3" />
                )}
            </div>
            {/* <span className="font-mono text-xs text-zinc-300">
                {truncatedAddress}
            </span> */}
            
        </button>
    )
}