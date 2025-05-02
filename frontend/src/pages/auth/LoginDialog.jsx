import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Login from "./Login"
import { FaXTwitter } from "react-icons/fa6";
import { GoogleLogin } from '@react-oauth/google';

export default function LoginDialog({ open, onOpenChange, setDialogType }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white" aria-describedby={undefined}
      >

        <DialogHeader>
          <div className="flex justify-center mb-6">
            <FaXTwitter size={40} />
          </div>
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader>
        <Login />
        <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="px-4 text-gray-400">OR</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>
        <GoogleLogin
          onSuccess={(credentialResponse) => console.log(credentialResponse)}
          onError={() => console.log('Login Failed')}
          shape="pill"
        />

        <div className="mt-4">
          <button className="w-full text-blue-500 hover:underline text-sm">
            Forgot password?
          </button>
        </div>
        <div className="text-center">
          <p className="text-gray-500">
            <p className="mt-3 text-gray-500 text-sm">
              Don't have an account? <button onClick={() => { setDialogType('register') }} className="text-blue-500">Sign up</button>
            </p>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
