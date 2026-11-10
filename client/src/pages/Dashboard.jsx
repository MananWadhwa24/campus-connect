import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import gsap from "gsap";
import {
  FileText,
  ShoppingBag,
  Bell,
  MessageSquare,
  Briefcase,
  Search,
  ArrowRight,
  LogOut,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { onlineCount, isConnected } = useSocket();

  const [recentNotices, setRecentNotices] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [recentMarketplace, setRecentMarketplace] = useState([]);
  const [loading, setLoading] = useState(true);

  const dashboardRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [noticesRes, notesRes, marketRes] = await Promise.allSettled([
          API.get("/notices"),
          API.get("/notes"),
          API.get("/marketplace"),
        ]);

        if (noticesRes.status === "fulfilled" && noticesRes.value.data?.notices) {
          setRecentNotices(noticesRes.value.data.notices.slice(0, 3));
        }
        if (notesRes.status === "fulfilled" && notesRes.value.data?.notes) {
          setRecentNotes(notesRes.value.data.notes.slice(0, 3));
        }
        if (marketRes.status === "fulfilled" && marketRes.value.data?.items) {
          setRecentMarketplace(marketRes.value.data.items.slice(0, 3));
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".dash-header", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      });
      gsap.from(".dash-card", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        stagger: 0.08,
        delay: 0.2,
        ease: "power3.out",
      });
    }, dashboardRef);

    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Student";
  const displayEmail = user?.email || "user@college.edu";
  const displayRole = user?.role ? user.role.toUpperCase() : "STUDENT";

  return (
    <div ref={dashboardRef} className="min-h-screen bg-[#131417] text-[#ECE8E1] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12 flex-1">
        {/* Top Welcome Panel */}
        <div className="dash-header flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-[rgba(236,232,225,0.12)]">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#79C043] font-bold">
                Student Terminal
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8D9099]" />
              <span className="font-mono text-xs text-[#8D9099]">
                {displayRole} PROFILE
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-[#ECE8E1] tracking-tight">
              WELCOME BACK, {displayName.toUpperCase()}
            </h1>
            <p className="font-mono text-xs text-[#8D9099]">
              ID: {displayEmail} • Authenticated Session
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-[#1C1E22] border border-[rgba(236,232,225,0.12)] px-4 py-2.5 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#79C043] animate-pulse" />
              <span>
                <strong className="text-[#ECE8E1] font-bold">{onlineCount}</strong>{" "}
                STUDENTS ONLINE
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-red-400 font-mono text-xs transition"
            >
              <LogOut size={14} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* 6 Primary Action Modules */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#8D9099] font-bold">
              Core Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Notes */}
            <Link
              to="/notes"
              className="dash-card group bg-[#1C1E22] hover:bg-[#26292E] p-6 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#131417] border border-[rgba(236,232,225,0.15)] flex items-center justify-center text-[#79C043]">
                  <FileText size={20} />
                </div>
                <h3 className="font-display text-xl font-black text-[#ECE8E1] mt-5 group-hover:text-[#79C043] transition">
                  Notes & PDF Library
                </h3>
                <p className="text-xs text-[#8D9099] mt-2 leading-relaxed">
                  Upload course PDFs, preview study sheets in the viewer, and export notes.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] text-[#79C043] font-bold flex items-center gap-1">
                <span>Open Library</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Marketplace */}
            <Link
              to="/marketplace"
              className="dash-card group bg-[#1C1E22] hover:bg-[#26292E] p-6 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#131417] border border-[rgba(236,232,225,0.15)] flex items-center justify-center text-[#79C043]">
                  <ShoppingBag size={20} />
                </div>
                <h3 className="font-display text-xl font-black text-[#ECE8E1] mt-5 group-hover:text-[#79C043] transition">
                  Student Marketplace
                </h3>
                <p className="text-xs text-[#8D9099] mt-2 leading-relaxed">
                  Peer-to-peer campus marketplace for books, tools, and gadgets.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] text-[#79C043] font-bold flex items-center gap-1">
                <span>Browse Listings</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Chat */}
            <Link
              to="/chat"
              className="dash-card group bg-[#1C1E22] hover:bg-[#26292E] p-6 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#131417] border border-[rgba(236,232,225,0.15)] flex items-center justify-center text-[#79C043]">
                  <MessageSquare size={20} />
                </div>
                <h3 className="font-display text-xl font-black text-[#ECE8E1] mt-5 group-hover:text-[#79C043] transition">
                  Community Chat
                </h3>
                <p className="text-xs text-[#8D9099] mt-2 leading-relaxed">
                  Real-time campus lounge with persistent history and live presence.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] text-[#79C043] font-bold flex items-center gap-1">
                <span>Enter Lounge</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Notices */}
            <Link
              to="/notices"
              className="dash-card group bg-[#1C1E22] hover:bg-[#26292E] p-6 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#131417] border border-[rgba(236,232,225,0.15)] flex items-center justify-center text-[#79C043]">
                  <Bell size={20} />
                </div>
                <h3 className="font-display text-xl font-black text-[#ECE8E1] mt-5 group-hover:text-[#79C043] transition">
                  Campus Notices
                </h3>
                <p className="text-xs text-[#8D9099] mt-2 leading-relaxed">
                  Official circulars, exam dates, and administrative releases.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] text-[#79C043] font-bold flex items-center gap-1">
                <span>View Notices</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Placements */}
            <Link
              to="/placements"
              className="dash-card group bg-[#1C1E22] hover:bg-[#26292E] p-6 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#131417] border border-[rgba(236,232,225,0.15)] flex items-center justify-center text-[#79C043]">
                  <Briefcase size={20} />
                </div>
                <h3 className="font-display text-xl font-black text-[#ECE8E1] mt-5 group-hover:text-[#79C043] transition">
                  Placements & Internships
                </h3>
                <p className="text-xs text-[#8D9099] mt-2 leading-relaxed">
                  Active recruitment drives, roles, eligibility, and direct apply links.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] text-[#79C043] font-bold flex items-center gap-1">
                <span>View Drives</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Lost & Found */}
            <Link
              to="/lost-found"
              className="dash-card group bg-[#1C1E22] hover:bg-[#26292E] p-6 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#131417] border border-[rgba(236,232,225,0.15)] flex items-center justify-center text-[#79C043]">
                  <Search size={20} />
                </div>
                <h3 className="font-display text-xl font-black text-[#ECE8E1] mt-5 group-hover:text-[#79C043] transition">
                  Lost & Found Registry
                </h3>
                <p className="text-xs text-[#8D9099] mt-2 leading-relaxed">
                  Report missing items on campus and mark found items as resolved.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] text-[#79C043] font-bold flex items-center gap-1">
                <span>Open Registry</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* Real-time Feeds: Recent Notices & Recent Notes */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Notices Feed */}
          <div className="bg-[#1C1E22] border border-[rgba(236,232,225,0.12)] p-6 sm:p-8 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[rgba(236,232,225,0.1)]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#79C043] font-bold">
                Live Notices Feed
              </span>
              <Link
                to="/notices"
                className="font-mono text-xs text-[#8D9099] hover:text-[#ECE8E1]"
              >
                All Notices →
              </Link>
            </div>

            <div className="space-y-3">
              {recentNotices.length > 0 ? (
                recentNotices.map((notice) => (
                  <div
                    key={notice._id}
                    className="p-3.5 bg-[#131417] rounded-xl border border-[rgba(236,232,225,0.06)] hover:border-[rgba(236,232,225,0.15)] transition"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-[#ECE8E1] line-clamp-1">
                        {notice.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(121,192,67,0.1)] text-[#79C043] font-bold uppercase shrink-0">
                        {notice.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#8D9099] mt-1 line-clamp-2">
                      {notice.description}
                    </p>
                    <p className="text-[10px] font-mono text-[#8D9099]/60 mt-2">
                      Posted: {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs font-mono text-[#8D9099] py-4 text-center">
                  No active notices in database.
                </p>
              )}
            </div>
          </div>

          {/* Recent Notes Library Feed */}
          <div className="bg-[#1C1E22] border border-[rgba(236,232,225,0.12)] p-6 sm:p-8 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[rgba(236,232,225,0.1)]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#79C043] font-bold">
                Recently Added Notes
              </span>
              <Link
                to="/notes"
                className="font-mono text-xs text-[#8D9099] hover:text-[#ECE8E1]"
              >
                All Notes →
              </Link>
            </div>

            <div className="space-y-3">
              {recentNotes.length > 0 ? (
                recentNotes.map((note) => (
                  <div
                    key={note._id}
                    className="p-3.5 bg-[#131417] rounded-xl border border-[rgba(236,232,225,0.06)] hover:border-[rgba(236,232,225,0.15)] transition"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-[#ECE8E1] line-clamp-1">
                        {note.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1E22] text-[#ECE8E1] border border-[rgba(236,232,225,0.1)] shrink-0">
                        {note.semester}
                      </span>
                    </div>
                    <p className="text-xs text-[#8D9099] mt-1 line-clamp-1">
                      {note.description}
                    </p>
                    <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-[#8D9099]/60">
                      <span>Branch: {note.branch}</span>
                      {note.fileUrl && (
                        <span className="text-[#79C043] font-bold">PDF ATTACHED</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-mono text-[#8D9099] py-4 text-center">
                  No notes uploaded yet.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* System Demonstration & Viva Status Panel */}
        <section className="bg-[#1C1E22] border border-[rgba(236,232,225,0.12)] p-6 rounded-2xl font-mono text-xs">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[#79C043] uppercase text-[10px] font-bold tracking-widest block">
                VIVA DEFENSE READY // ARCHITECTURAL HEALTH
              </span>
              <p className="text-sm text-[#ECE8E1] font-bold mt-1">
                Campus Connect Cloud Core • Node.js Express 5 & MongoDB Atlas
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="px-3 py-1 rounded-md bg-[#131417] border border-[rgba(236,232,225,0.1)] text-[#79C043]">
                JWT Auth: Active
              </span>
              <span className="px-3 py-1 rounded-md bg-[#131417] border border-[rgba(236,232,225,0.1)] text-[#79C043]">
                Sockets: {isConnected ? "Connected" : "Reconnecting"}
              </span>
              <span className="px-3 py-1 rounded-md bg-[#131417] border border-[rgba(236,232,225,0.1)] text-[#79C043]">
                PDF Engine: Multer + In-App Viewer
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
