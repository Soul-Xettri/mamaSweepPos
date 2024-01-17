"use client";

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "./ui/avatar"

interface UserAvatarProps{
    className? : String
};

export const UserAvatar = ({className}:UserAvatarProps) => {
    return(
        <div>
            <Avatar className={cn(
                "h-7 w-7 md:h-10 md:w-10",
                className
            )}>
                <AvatarImage src={"https://discord-clone-production-a625.up.railway.app/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F31490cda-0fab-496f-911a-4e703647ce7f-2gilbr.jpg&w=1920&q=75"}/>
            </Avatar>
        </div>
    )
}