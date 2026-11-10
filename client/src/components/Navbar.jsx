import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useTheme } from "../context/ThemeContext";
import {
  Menu,
  X,
  Radio,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { onlineCount } = useSocket();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Notes", path: "/notes" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Notices", path: "/notices" },
    { name: "Community Chat", path: "/chat" },
    { name: "Placements", path: "/placements" },
  ];

  return (
    <nav className="bg-[#131417]/90 backdrop-blur-md border-b border-[rgba(236,232,225,0.12)] sticky top-0 z-40 text-[#ECE8E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] flex items-center justify-center group-hover:border-[#79C043] transition">
              <span className="font-display text-[#79C043] text-xl font-black">
                C
              </span>
            </div>
            <div>
              <span className="font-display text-lg tracking-wider text-[#ECE8E1] block leading-none">
                CAMPUS<span className="text-[#79C043]">CONNECT</span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8D9099] mt-0.5 block">
                Student Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition ${
                    active
                      ? "text-[#79C043] bg-[rgba(121,192,67,0.08)] border border-[rgba(121,192,67,0.2)]"
                      : "text-[#8D9099] hover:text-[#ECE8E1] hover:bg-[#1C1E22]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1E22] border border-[rgba(236,232,225,0.1)] text-[11px] font-mono text-[#8D9099]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#79C043] animate-pulse" />
              <span>
                <strong className="text-[#ECE8E1] font-bold">{onlineCount}</strong>{" "}
                ONLINE
              </span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[#1C1E22] hover:bg-[#26292E] border border-[rgba(236,232,225,0.15)] hover:border-[#79C043] text-[#8D9099] hover:text-[#ECE8E1] transition flex items-center justify-center cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={16} className="text-amber-400 transition transform hover:rotate-45" />
              ) : (
                <Moon size={16} className="text-indigo-500 transition transform hover:-rotate-12" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1C1E22] hover:bg-[#26292E] border border-[rgba(236,232,225,0.15)] hover:border-[#79C043] text-xs font-mono uppercase tracking-wider text-[#ECE8E1] transition">
                    <LayoutDashboard size={14} className="text-[#79C043]" />
                    <span>Dashboard</span>
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-[#1C1E22] hover:bg-red-950/40 border border-[rgba(236,232,225,0.15)] hover:border-red-500/50 text-[#8D9099] hover:text-red-400 transition"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-mono uppercase tracking-wider text-[#8D9099] hover:text-[#ECE8E1] px-2 py-1 transition"
                >
                  Sign In
                </Link>
                <Link to="/signup">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] text-xs font-mono uppercase tracking-wider font-bold transition shadow-sm">
                    <span>Join</span>
                    <ArrowRight size={13} />
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger & Theme Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] text-[#ECE8E1] cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={17} className="text-amber-400" />
              ) : (
                <Moon size={17} className="text-indigo-500" />
              )}
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C1E22] border border-[rgba(236,232,225,0.1)] text-[10px] font-mono text-[#8D9099]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#79C043] animate-pulse" />
              <span>{onlineCount}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] text-[#ECE8E1]"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[rgba(236,232,225,0.1)] bg-[#131417] px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-[#8D9099] hover:text-[#ECE8E1] hover:bg-[#1C1E22]"
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Theme Toggle Row */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] text-xs font-mono uppercase tracking-wider text-[#ECE8E1] transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {isDark ? (
                <Sun size={15} className="text-amber-400" />
              ) : (
                <Moon size={15} className="text-indigo-500" />
              )}
              <span>Theme: {isDark ? "Dark Mode" : "Light Mode"}</span>
            </span>
            <span className="text-[10px] text-[#79C043] font-bold">Switch</span>
          </button>

          <div className="pt-4 border-t border-[rgba(236,232,225,0.1)] space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] text-xs font-mono uppercase tracking-wider text-[#ECE8E1]"
                >
                  <LayoutDashboard size={14} className="text-[#79C043]" />
                  <span>Open Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-mono uppercase tracking-wider text-red-400"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] text-xs font-mono uppercase tracking-wider text-[#ECE8E1]"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-[#79C043] text-xs font-mono uppercase tracking-wider font-bold text-[#131417]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
