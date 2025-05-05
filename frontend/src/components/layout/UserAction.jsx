import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreVertical,
    AlertTriangle,
    LogOut
} from "lucide-react";
import { use, useState } from 'react';
import { logout } from "../../store/slices/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export function UserAction() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLoagout = () => {
        console.log('clikced')
        dispatch(logout())
        navigate("/auth")
    }
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <MoreVertical className="text-gray-400 hover:text-gray-500 flex-shrink-0 cursor-pointer h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-gray-950 border border-gray-800 p-1 rounded-lg shadow-lg">
                <DropdownMenuItem className="flex items-center gap-3 p-2 text-sm text-gray-200 hover:text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded-md group" onClick={handleLoagout}>
                    <LogOut className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    <span >Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
