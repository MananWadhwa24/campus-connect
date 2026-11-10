import { Link } from "react-router-dom";
import {
  FileText,
  ShoppingBag,
  Bell,
  MessageSquare,
  Briefcase,
  Search,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
} from "lucide-react";

function Features() {
  return (
    <div className="space-y-24">
      {/* Primary Modules - Varied Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 pb-6 border-b border-[rgba(236,232,225,0.12)]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#79C043]">
              01 // Core Modules
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#ECE8E1] mt-2 font-black">
              ENGINEERED FOR CAMPUS LIFE.
            </h2>
          </div>
          <p className="text-sm font-mono text-[#8D9099] max-w-md">
            Six purpose-built student modules connected to persistent MongoDB Atlas
            storage and real-time Socket.IO.
          </p>
        </div>

        {/* Varied Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Module 1: Notes (Large feature span 7) */}
          <Link
            to="/notes"
            className="md:col-span-7 group bg-[#1C1E22] hover:bg-[#26292E] p-8 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-[#131417] border border-[rgba(236,232,225,0.15)] flex items-center justify-center text-[#79C043]">
                  <FileText size={22} />
                </div>
                <span className="font-mono text-[11px] text-[#8D9099] uppercase tracking-wider">
                  PDF Import • In-App Viewer • Export
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-[#ECE8E1] mt-6 group-hover:text-[#79C043] transition">
                Notes & Syllabus Library
              </h3>
              <p className="text-sm text-[#8D9099] mt-3 leading-relaxed max-w-lg">
                Upload course PDFs up to 15MB, preview study material directly in
                the browser without leaving the page, and export structured note
                sheets as printable PDFs.
              </p>
            </div>
            <div className="pt-8 flex items-center gap-2 font-mono text-xs text-[#79C043] font-bold">
              <span>Access Notes Archive</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 2: Community Chat (Span 5) */}
          <Link
            to="/chat"
            className="md:col-span-5 group bg-[#1C1E22] hover:bg-[#26292E] p-8 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-[#131417] border border-[rgba(236,232,225,0.15)] flex items-center justify-center text-[#79C043]">
                  <MessageSquare size={22} />
                </div>
                <span className="font-mono text-[11px] text-[#79C043] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#79C043] animate-pulse" />
                  Socket.IO Active
                </span>
              </div>
              <h3 className="font-display text-2xl font-black text-[#ECE8E1] mt-6 group-hover:text-[#79C043] transition">
                Real-Time Campus Lounge
              </h3>
              <p className="text-sm text-[#8D9099] mt-3 leading-relaxed">
                Persistent instant messaging with verified student profiles,
                live typing status, and unique online student counts.
              </p>
            </div>
            <div className="pt-8 flex items-center gap-2 font-mono text-xs text-[#79C043] font-bold">
              <span>Enter Community Lounge</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 3: Marketplace (Span 4) */}
          <Link
            to="/marketplace"
            className="md:col-span-4 group bg-[#1C1E22] hover:bg-[#26292E] p-8 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#131417] border border-[rgba(236,232,225,0.15)] flex items-center justify-center text-[#79C043]">
                <ShoppingBag size={22} />
              </div>
              <h3 className="font-display text-xl font-black text-[#ECE8E1] mt-6 group-hover:text-[#79C043] transition">
                Student Marketplace
              </h3>
              <p className="text-sm text-[#8D9099] mt-2 leading-relaxed">
                Buy and sell drafters, scientific calculators, engineering
                textbooks, and lab components within hostels.
              </p>
            </div>
            <div className="pt-6 font-mono text-xs text-[#79C043] flex items-center gap-1 font-bold">
              <span>Browse Listings →</span>
            </div>
          </Link>

          {/* Module 4: Notices (Span 4) */}
          <Link
            to="/notices"
            className="md:col-span-4 group bg-[#1C1E22] hover:bg-[#26292E] p-8 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#131417] border border-[rgba(236,232,225,0.15)] flex items-center justify-center text-[#79C043]">
                <Bell size={22} />
              </div>
              <h3 className="font-display text-xl font-black text-[#ECE8E1] mt-6 group-hover:text-[#79C043] transition">
                Notices & Circulars
              </h3>
              <p className="text-sm text-[#8D9099] mt-2 leading-relaxed">
                Centralized academic notices, exam timetable releases, and
                authorized college circulars with category filters.
              </p>
            </div>
            <div className="pt-6 font-mono text-xs text-[#79C043] flex items-center gap-1 font-bold">
              <span>Read Notices →</span>
            </div>
          </Link>

          {/* Module 5: Placements & Lost & Found (Span 4) */}
          <div className="md:col-span-4 grid grid-rows-2 gap-6">
            <Link
              to="/placements"
              className="group bg-[#1C1E22] hover:bg-[#26292E] p-6 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex justify-between items-center"
            >
              <div>
                <span className="font-mono text-[10px] uppercase text-[#79C043] font-bold">
                  Careers & Drives
                </span>
                <h4 className="font-display text-lg font-bold text-[#ECE8E1] mt-1">
                  Placement Portal
                </h4>
              </div>
              <Briefcase size={20} className="text-[#8D9099] group-hover:text-[#79C043] transition" />
            </Link>

            <Link
              to="/lost-found"
              className="group bg-[#1C1E22] hover:bg-[#26292E] p-6 rounded-2xl border border-[rgba(236,232,225,0.12)] hover:border-[#79C043] transition flex justify-between items-center"
            >
              <div>
                <span className="font-mono text-[10px] uppercase text-[#79C043] font-bold">
                  Campus Registry
                </span>
                <h4 className="font-display text-lg font-bold text-[#ECE8E1] mt-1">
                  Lost & Found
                </h4>
              </div>
              <Search size={20} className="text-[#8D9099] group-hover:text-[#79C043] transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Campus Connect Exists Section */}
      <section className="bg-[#1C1E22] border-y border-[rgba(236,232,225,0.12)] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#79C043]">
              02 // RATIONALE & PURPOSE
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-[#ECE8E1] leading-tight">
              WHY CAMPUS CONNECT EXISTS.
            </h2>
            <p className="text-sm text-[#8D9099] leading-relaxed">
              Traditional college information is scattered across unmonitored
              messaging groups, fragmented noticeboards, and lost social threads.
              Campus Connect was engineered to centralize academic workflow into a
              unified, authenticated portal.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
            <div className="bg-[#131417] p-6 rounded-xl border border-[rgba(236,232,225,0.1)] space-y-3">
              <div className="text-[#79C043]">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-sm font-bold text-[#ECE8E1]">Verified Student Identity</h4>
              <p className="text-[#8D9099] leading-relaxed">
                JWT-secured sessions ensure only verified students and college members
                can publish notes, list marketplace items, or join the chat.
              </p>
            </div>

            <div className="bg-[#131417] p-6 rounded-xl border border-[rgba(236,232,225,0.1)] space-y-3">
              <div className="text-[#79C043]">
                <Cpu size={24} />
              </div>
              <h4 className="text-sm font-bold text-[#ECE8E1]">Zero Cloud Vendor Lock-in</h4>
              <p className="text-[#8D9099] leading-relaxed">
                Utilizes standard Node.js Express architecture and MongoDB Atlas
                without relying on proprietary Firebase dependencies.
              </p>
            </div>

            <div className="bg-[#131417] p-6 rounded-xl border border-[rgba(236,232,225,0.1)] space-y-3">
              <div className="text-[#79C043]">
                <Layers size={24} />
              </div>
              <h4 className="text-sm font-bold text-[#ECE8E1]">In-Browser PDF Management</h4>
              <p className="text-[#8D9099] leading-relaxed">
                Students can preview and read uploaded academic PDFs instantly in
                the portal with full zoom, navigation, and export support.
              </p>
            </div>

            <div className="bg-[#131417] p-6 rounded-xl border border-[rgba(236,232,225,0.1)] space-y-3">
              <div className="text-[#79C043]">
                <MessageSquare size={24} />
              </div>
              <h4 className="text-sm font-bold text-[#ECE8E1]">Sub-50ms Real-Time Sync</h4>
              <p className="text-[#8D9099] leading-relaxed">
                Socket.IO maintains bidirectional communication for instant campus
                discussions, live typing status, and real-time online presence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
        <div className="bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-4xl sm:text-5xl font-black text-[#ECE8E1]">
              READY TO ACCELERATE YOUR CAMPUS EXPERIENCE?
            </h2>
            <p className="text-sm font-mono text-[#8D9099]">
              Join your college peers on Campus Connect. No setup required.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <button className="px-8 py-4 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs uppercase tracking-widest font-bold transition">
                  Create Student Account
                </button>
              </Link>
              <Link to="/login">
                <button className="px-8 py-4 rounded-xl bg-[#131417] border border-[rgba(236,232,225,0.2)] hover:border-[#79C043] text-[#ECE8E1] font-mono text-xs uppercase tracking-widest transition">
                  Sign In Existing
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;
