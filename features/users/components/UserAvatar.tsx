// React
import { ComponentProps } from "react";
// ShadCn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IUserAvatar extends ComponentProps<typeof Avatar> {
    imageUrl: string;
    name: string;
}

export function UserAvatar({ imageUrl, name, ...props }: IUserAvatar) {
    return (
        <Avatar {...props}>
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="uppercase">
                {name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
            </AvatarFallback>
        </Avatar>
    );
}
