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
// import { toast } from "sonner"
import { authAxios } from "../../api/useAxios"; // Import authAxios
import { toast } from "react-toastify";

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

    const handleMuteClick = async (e) => {
        e.stopPropagation();
        if (!tweet?.author?.id) return;
        try {
            const response = await authAxios.post(`/mute/${tweet.author.id}/`);
            if (response.status === 201) {
                toast.success(`@${tweet.author.username} muted`);
            } else {
                toast.error("Failed to mute user");
            }
        } catch (error) {
            let errorMessage = "Failed to mute user";
            if (error.response?.data) {
                errorMessage = Object.values(error.response.data).join(", ");
            }
            toast.error(errorMessage);
        }
        setOpen(false);
    };

    const handleBlockClick = (e) => {
        e.stopPropagation();
        console.log("Block clicked");
        setOpen(false);
    };

    const handleReportClick = async (e) => {
        e.stopPropagation();
        console.log("Report clicked");
        if (!tweet?.author?.id) return;
        try {
            const response = await authAxios.post(`/report/${tweet.id}/`, {
                reason: "Reporting this post.", // Add a reason, you might want a better UI for this
            });
            if (response.status === 201) {
                toast.success(`@${tweet.author.username} reported`);
            }
            else {
                toast.error("Failed to report user");
            }
        } catch (error) {
            console.error("Error reporting user:", error);
            let errorMessage = "Failed to report user";
            if (error.response?.data) {
                errorMessage = Object.values(error.response.data).join(", ");
            }
            toast.error(errorMessage);
        }
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
                    <span>Follow @{tweet?.author?.username || 'Unknown'}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group"
                    onClick={handleMuteClick}
                >
                    <Volume2 className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Mute @{tweet?.author?.username || 'Unknown'}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group"
                    onClick={handleBlockClick}
                >
                    <Ban className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span>Block @{tweet?.author?.username || 'Unknown'}</span>
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

