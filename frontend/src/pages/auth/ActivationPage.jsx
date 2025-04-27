import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { activateAccount } from "../../api/users";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button"

const ActivateAccount = () => {
  const [status, setStatus] = useState("activating");
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const activate = async () => {
      try {
        if (!uid || !token) throw new Error("Invalid activation link");

        const res = await activateAccount(uid, token);
        if (res.status === 204) {
          setStatus("success");
          toast.success("Account activated!");
          setTimeout(() => navigate("/auth"), 3000);
        }
      } catch (error) {
        setStatus("error");
        toast.error(error instanceof Error ? error.message : "Activation failed");
      }
    };

    activate();
  }, [uid, token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-black p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-6 text-center">
          {/* Twitter Logo */}
          <FaXTwitter className="h-10 w-10 text-blue-400" />

          {/* Status Headings */}
          <h2 className="text-2xl font-bold text-white">
            {status === "activating" && "Activating Account"}
            {status === "success" && "Activation Complete!"}
            {status === "error" && "Activation Failed"}
          </h2>

          <p className="text-gray-400">
            {status === "activating" && "Just a moment..."}
            {status === "success" && "Your account is now ready to use"}
            {status === "error" && "Please try again or contact support"}
          </p>

          {/* Status-specific content */}
          {status === "activating" && (
            <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
          )}

          {status === "success" && (
            <div className="w-full space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/50">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <div className="w-full overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-1.5 bg-blue-400 transition-all duration-300 ease-out"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="w-full space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-900/50">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  variant="primary"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => navigate("/auth")}
                  className="flex-1 rounded-full border border-gray-700 py-2 font-medium text-white hover:bg-gray-800"
                  variant="twitter"

                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;