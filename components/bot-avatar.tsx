import { Avatar, AvatarImage } from "./ui/avatar"

export default function BotAvatar() {
    return (
        <Avatar className="w-20 h-20 -mx-5">
            <AvatarImage className="p-0" src="https://firebasestorage.googleapis.com/v0/b/bcu-study-space-cded8.appspot.com/o/logo.png?alt=media&token=5f0fb83a-2a0b-4037-93cf-f2df8cd5cd55"/>
        </Avatar>
    )
}