import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { FaXTwitter } from "react-icons/fa6";
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog';
import { Button } from "@/components/ui/button"

export default function AuthPage() {
    const [dialogType, setDialogType] = useState(null);

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-black text-white">
            <div className="w-full md:w-1/2 flex items-center justify-center py-10">
                <FaXTwitter className="w-24 h-24 md:w-64 md:h-64 lg:w-96 lg:h-96 opacity-90" />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-8 py-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-12">Happening now</h1>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8">Join today.</h2>

                <div className="flex flex-col gap-4 max-w-xs md:max-w-sm">
                    <GoogleLogin
                        onSuccess={(credentialResponse) => console.log(credentialResponse)}
                        onError={() => console.log('Login Failed')}
                        shape="pill"
                        text="signup_with"
                    />

                    <div className="flex items-center my-2">
                        <div className="flex-grow h-px bg-gray-700"></div>
                        <span className="px-4 text-gray-400">OR</span>
                        <div className="flex-grow h-px bg-gray-700"></div>
                    </div>

                    <Button variant="primary" onClick={() => setDialogType("register")}>
                        Create Your Account
                    </Button>

                    <p className="text-xs text-gray-500 mt-2">
                        By signing up, you agree to the{" "}
                        <a href="#" className="text-blue-500">Terms of Service</a> and{" "}
                        <a href="#" className="text-blue-500">Privacy Policy</a>, including{" "}
                        <a href="#" className="text-blue-500">Cookie Use</a>.
                    </p>
                </div>

                {/* Sign in section */}
                <div className="mt-8 md:mt-12">
                    <p className="mb-4 font-semibold">Already have an account?</p>
                    <Button variant="twitter" onClick={() => setDialogType("login")}>
                        Sign In
                    </Button>
                </div>
                {/* Dialogs */}
                <LoginDialog open={dialogType === "login"} onOpenChange={(open) => setDialogType(open ? "login" : null)} setDialogType={setDialogType} />
                <RegisterDialog open={dialogType === "register"} onOpenChange={(open) => setDialogType(open ? "register" : null)} setDialogType={setDialogType} />
            </div>
        </div>
    );
}
