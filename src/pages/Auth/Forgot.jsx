import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Key } from "lucide-react";
import SuccessView from "../../components/SuccessView";

const Forgot = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMode, setSuccessMode] = useState(false);
  const navigate = useNavigate();
  // We expose the dev token so the user can actually test the Reset flow without an email inbox
  const [devToken, setDevToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const res = await forgotPassword(email);
    if (res.success) {
      setSuccessMode(true);
    } else {
      setErrorMsg(res.error);
    }
    setLoading(false);
  };

  if (successMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/auth_bg.png')" }}>
        <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm"></div>
        <div className="relative z-10 bg-white/95 backdrop-blur-md border border-white/20 p-8 mb-[100px] rounded-2xl shadow-2xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Inbox</h2>
            <p className="text-gray-600 mb-4">We've sent a password reset token to <b>{email}</b>. Please check your inbox and copy the token to proceed.</p>
            <button
               onClick={() => navigate("/reset-password")}
               className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mt-2"
            >
               Enter Token
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/auth_bg.png')" }}>
      <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 mb-[10vh]">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Key className="text-primary w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-secondary mb-2">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Enter your email and we'll send you a link to reset your password.
        </p>
        
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">
          Remember it?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Forgot;
