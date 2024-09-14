import Image from "next/image";
import logo from "../public/logo.png"

export default function Loader() {
    return (
        <div className="h-full flex flex-col gap-y-4 items-center justify-center">
            <div className="w-28 h-28 relative animate-spin">
                <Image alt="logo" fill src={logo}/>
            </div>
            <p className="text-sm text-muted-foreground">
                AdaptED is responding...
            </p>
        </div>
    )
}