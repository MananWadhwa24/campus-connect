import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Lock, Mail, AlertCircle, Sparkles } from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both college email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Invalid credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131417] text-[#ECE8E1] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] flex items-center justify-center">
            <span className="font-display text-[#79C043] text-lg font-black">C</span>
          </div>
          <span className="font-display text-base tracking-wider text-[#ECE8E1]">
            CAMPUS<span className="text-[#79C043]">CONNECT</span>
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-mono uppercase tracking-wider text-[#8D9099] hover:text-[#ECE8E1] transition"
        >
          ← Return to Home
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto bg-[#1C1E22] border border-[rgba(236,232,225,0.12)] p-8 sm:p-10 rounded-2xl shadow-2xl">
        <div className="space-y-2 mb-8">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#79C043] font-bold">
            Portal Access
          </span>
          <h1 className="font-display text-3xl font-black tracking-tight text-[#ECE8E1]">
            SIGN IN TO CAMPUS.
          </h1>
          <p className="text-sm text-[#8D9099]">
            Enter your credentials to access verified college resources.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono p-3.5 rounded-xl mb-6 flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#8D9099] mb-1.5">
              College Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D9099]" />
              <input
                type="email"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                required
                className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl py-3 pl-10 pr-4 text-sm text-[#ECE8E1] placeholder:text-[#8D9099]/50 focus:outline-none focus:border-[#79C043] transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#8D9099] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D9099]" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                required
                className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl py-3 pl-10 pr-4 text-sm text-[#ECE8E1] placeholder:text-[#8D9099]/50 focus:outline-none focus:border-[#79C043] transition font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs uppercase tracking-widest font-bold transition disabled:opacity-50 shadow-md"
          >
            <span>{loading ? "AUTHENTICATING..." : "SIGN IN"}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[rgba(236,232,225,0.1)] text-center text-xs font-mono text-[#8D9099]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#79C043] font-bold hover:underline"
          >
            Create one here
          </Link>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="max-w-7xl mx-auto w-full text-center py-4 text-xs font-mono text-[#8D9099]/60">
        Secured with bcryptjs • JWT Token Authentication
      </div>
    </div>
  );
}

export default LoginPage;
