import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaXTwitter } from "react-icons/fa6";
import RegisterForm from "./RegisterForm";

export default function RegisterDialog({ open, onOpenChange, setDialogType }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-black text-white" aria-describedby={undefined}
            >
                <DialogHeader>
                    <div className="flex justify-center mb-6">
                        <FaXTwitter size={40} />
                    </div>
                    <DialogTitle>Create your account</DialogTitle>
                </DialogHeader>
                <RegisterForm setDialogType={setDialogType} />

                <div className="text-center">
                    <p className="text-gray-500">
                        <p className="mt-3 text-gray-500 text-sm">
                            Don't have an account? <button onClick={() => { setDialogType('login') }} className="text-blue-500">Sign in</button>
                        </p>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

