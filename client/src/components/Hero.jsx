import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import gsap from "gsap";
import { ArrowUpRight, Terminal, Shield, Zap, Sparkles } from "lucide-react";

function Hero() {
  const { isAuthenticated } = useAuth();
  const { onlineCount } = useSocket();
  const heroRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".hero-badge", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".hero-heading", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.from(".hero-subtext", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.from(".hero-cta", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.45,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".hero-stat-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Background Graphic Lines */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#79C043]/15 via-transparent to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-4xl">
        {/* Editorial Pill Badge */}
        <div className="hero-badge inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] text-[#ECE8E1] text-xs font-mono mb-8">
          <span className="w-2 h-2 rounded-full bg-[#79C043] animate-pulse" />
          <span className="tracking-wider uppercase text-[11px] text-[#8D9099]">
            CAMPUS PORTAL 2.0 •
          </span>
          <span className="text-[#79C043] font-bold">
            {onlineCount} STUDENTS LIVE
          </span>
        </div>

        {/* Large Editorial Heading */}
        <h1 className="hero-heading font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#ECE8E1] leading-[0.95]">
          YOUR CAMPUS. <br />
          <span className="text-[#79C043]">YOUR COMMUNITY.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="hero-subtext mt-8 text-lg sm:text-2xl text-[#8D9099] max-w-2xl font-normal leading-relaxed">
          One place to connect, collaborate, discover opportunities and make
          campus life easier.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="hero-cta">
            <button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-sm uppercase tracking-wider font-bold transition shadow-lg hover:shadow-[#79C043]/20 hover:-translate-y-0.5">
              <span>{isAuthenticated ? "Open Dashboard" : "Join Community"}</span>
              <ArrowUpRight size={18} />
            </button>
          </Link>

          <Link to={isAuthenticated ? "/notes" : "/login"} className="hero-cta">
            <button className="flex items-center gap-2 px-7 py-4 rounded-xl bg-[#1C1E22] hover:bg-[#26292E] border border-[rgba(236,232,225,0.2)] hover:border-[#79C043] text-[#ECE8E1] font-mono text-sm uppercase tracking-wider font-semibold transition">
              <span>Explore Campus</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Live Spec Banner */}
      <div className="hero-stat-card mt-20 pt-8 border-t border-[rgba(236,232,225,0.12)] grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
        <div>
          <span className="text-[#8D9099] block text-[10px] uppercase tracking-widest">
            Architecture
          </span>
          <span className="text-[#ECE8E1] font-bold text-sm mt-1 block">
            React 19 + Express 5
          </span>
        </div>

        <div>
          <span className="text-[#8D9099] block text-[10px] uppercase tracking-widest">
            Real-Time Engine
          </span>
          <span className="text-[#79C043] font-bold text-sm mt-1 block flex items-center gap-1.5">
            <Zap size={14} /> Socket.IO Active
          </span>
        </div>

        <div>
          <span className="text-[#8D9099] block text-[10px] uppercase tracking-widest">
            Database Cluster
          </span>
          <span className="text-[#ECE8E1] font-bold text-sm mt-1 block">
            MongoDB Atlas (Verified)
          </span>
        </div>

        <div>
          <span className="text-[#8D9099] block text-[10px] uppercase tracking-widest">
            Storage Layer
          </span>
          <span className="text-[#ECE8E1] font-bold text-sm mt-1 block">
            Native PDF Storage & Viewer
          </span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
