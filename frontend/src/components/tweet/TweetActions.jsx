import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreVertical,
    X,
    UserPlus,
    Volume2,
    Ban,
    AlertTriangle,
} from "lucide-react";
import { useState } from 'react';


export function TweetActions() {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <MoreVertical className="text-gray-400 hover:text-gray-500 flex-shrink-0 cursor-pointer h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-gray-950 border border-gray-800 p-1 rounded-lg shadow-lg">
                <DropdownMenuItem className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group">
                    <X className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Not interested in this post</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group">
                    <UserPlus className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Follow @Ghhhoywsbp9610b</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group">
                    <Volume2 className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Mute @Ghhhoywsbp9610b</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group">
                    <Ban className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Block @Ghhhoywsbp9610b</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group">
                    <AlertTriangle className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Report post</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
