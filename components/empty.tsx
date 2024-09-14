import Image from "next/image";
import empty from "../public/empty.png";

interface EmptyProps {
    label: string;
}

export default function Empty({label}: EmptyProps) {
    return (
        <div className="h-full p-20 flex flex-col items-center justify-center">
            <div className="relative h-[400px] w-[360px]">
                <Image alt="Empty" fill src={empty}/>
                
            </div>
            <p className="text-muted-foreground text-sm text-center mt-3">
                {label}
            </p>
        </div>
    )
}