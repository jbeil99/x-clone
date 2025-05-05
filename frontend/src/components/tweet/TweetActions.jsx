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
    Edit
} from "lucide-react";
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { deleteTweetAction } from "../../store/slices/tweets";
import { toast } from "sonner"
export function TweetActions({ tweet }) {
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch();

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        console.log("hi")
        toast.success(`Tweet deleted`)
        dispatch(deleteTweetAction(tweet.id))
        setOpen(false);
    };

    const handleNotInterestedClick = (e) => {
        e.stopPropagation();
        console.log("Not interested clicked");
        setOpen(false);
    };

    const handleFollowClick = (e) => {
        e.stopPropagation();
        console.log("Follow clicked");
        setOpen(false);
    };

    const handleMuteClick = (e) => {
        e.stopPropagation();
        console.log("Mute clicked");
        setOpen(false);
    };

    const handleBlockClick = (e) => {
        e.stopPropagation();
        console.log("Block clicked");
        setOpen(false);
    };

    const handleReportClick = (e) => {
        e.stopPropagation();
        console.log("Report clicked");
        setOpen(false);
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <MoreVertical className="text-gray-400 hover:text-gray-500 flex-shrink-0 cursor-pointer h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-gray-950 border border-gray-800 p-1 rounded-lg shadow-lg">
                {user?.id === tweet?.author?.id ? (
                    <DropdownMenuItem
                        className="flex items-center gap-3 p-2 text-sm cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group"
                        onClick={handleDeleteClick}
                    >
                        <Edit className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">Delete</span>
                    </DropdownMenuItem>
                ) : null}

                <DropdownMenuItem
                    className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group"
                    onClick={handleNotInterestedClick}
                >
                    <X className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Not interested in this post</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group"
                    onClick={handleFollowClick}
                >
                    <UserPlus className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Follow @Ghhhoywsbp9610b</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group"
                    onClick={handleMuteClick}
                >
                    <Volume2 className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Mute @Ghhhoywsbp9610b</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group"
                    onClick={handleBlockClick}
                >
                    <Ban className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Block @Ghhhoywsbp9610b</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group"
                    onClick={handleReportClick}
                >
                    <AlertTriangle className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Report post</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}