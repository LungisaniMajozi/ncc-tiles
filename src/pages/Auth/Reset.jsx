import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Key, Lock } from "lucide-react";
import SuccessView from "../../components/SuccessView";

const Reset = () => {
  const { resetPassword } = useAuth();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const res = await resetPassword(token, password);
    if (res.success) {
      setSuccess(true);
    } else {
      setErrorMsg(res.error);
    }
    setLoading(false);
  };

  if (success) {
    return <SuccessView title="Password Restored!" message="You can now securely login with your new password." onContinue={() => navigate("/login")} />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/auth_bg.png')" }}>
      <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Lock className="text-primary w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-secondary mb-2">
          Reset Password
        </h2>
        
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Reset Token"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 chars, include uppercase, lowercase, number & special char.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Confirm Password"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Reset;
