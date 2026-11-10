import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToDashboard from "../components/BackToDashboard";
import {
  Briefcase,
  Search,
  MapPin,
  Calendar,
  ExternalLink,
  DollarSign,
  GraduationCap,
  Building,
  CheckCircle,
} from "lucide-react";

function Placements() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const placementDrives = [
    {
      id: 1,
      role: "Associate Software Engineer",
      company: "Cognitive Tech Solutions",
      type: "Full-Time",
      compensation: "₹8.5 - 12.0 LPA",
      location: "Bengaluru / Hybrid",
      eligibility: "B.Tech CSE / IT / ECE (Min. 7.0 CGPA)",
      skills: ["Java", "Spring Boot", "Data Structures", "PostgreSQL"],
      deadline: "Nov 30, 2026",
      description:
        "Seeking software engineering graduates proficient in object-oriented programming, cloud computing architectures, and scalable web API development.",
      applyUrl: "https://careers.google.com",
    },
    {
      id: 2,
      role: "Frontend Systems Intern",
      company: "Vertex Labs Cloud",
      type: "Internship",
      compensation: "₹25,000 / month",
      location: "Remote",
      eligibility: "Pre-final / Final Year Students",
      skills: ["React 19", "TypeScript", "Tailwind CSS", "REST/GraphQL"],
      deadline: "Dec 15, 2026",
      description:
        "6-month paid frontend engineering internship with full-time conversion opportunities. Focused on building high-performance modern web applications.",
      applyUrl: "https://careers.google.com",
    },
    {
      id: 3,
      role: "AI / Data Science Engineer",
      company: "Aether AI Research",
      type: "Full-Time",
      compensation: "₹14.0 - 18.0 LPA",
      location: "Gurgaon / Delhi NCR",
      eligibility: "B.Tech / M.Tech (Min. 7.5 CGPA)",
      skills: ["Python", "PyTorch", "NLP / LLMs", "MLOps"],
      deadline: "Dec 05, 2026",
      description:
        "Building foundational models, agentic workflows, and deploying scalable machine learning inferences for real-world automation.",
      applyUrl: "https://careers.google.com",
    },
    {
      id: 4,
      role: "Embedded Systems & IoT Engineer",
      company: "OmniRobotics India",
      type: "Full-Time",
      compensation: "₹7.0 - 9.5 LPA",
      location: "Pune",
      eligibility: "ECE / EE / CSE Branches",
      skills: ["C/C++", "RTOS", "Microcontrollers", "CAN/UART"],
      deadline: "Dec 10, 2026",
      description:
        "Developing firmware and sensory perception algorithms for autonomous industrial robotics and intelligent IoT gateways.",
      applyUrl: "https://careers.google.com",
    },
  ];

  const handleApply = (drive) => {
    alert(
      `[PLACEMENT DRIVE REGISTRATION]\n\nRole: ${drive.role}\nCompany: ${drive.company}\nPackage: ${drive.compensation}\nEligibility: ${drive.eligibility}\n\nYour profile verification has been logged with the Training & Placement Cell. Check your college email for round 1 assessment details.`
    );
  };

  const filteredDrives = placementDrives.filter((d) => {
    const matchesSearch = `${d.role} ${d.company} ${d.skills.join(" ")} ${d.location}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filterType === "All" || d.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#131417] text-[#ECE8E1] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <BackToDashboard />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 pb-6 border-b border-[rgba(236,232,225,0.12)]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#79C043] font-bold">
              05 // CAREERS & RECRUITMENT
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-[#ECE8E1] mt-2">
              PLACEMENT DRIVES.
            </h1>
            <p className="text-sm text-[#8D9099] mt-2">
              Official campus hiring drives, internship openings, and corporate partner listings.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#8D9099]">
            <span className="w-2 h-2 rounded-full bg-[#79C043]" />
            <span>T&P CELL VERIFIED RECRUITERS</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D9099]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drives by company, role, or skills (e.g. Python, React)..."
              className="w-full bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-[#ECE8E1] placeholder:text-[#8D9099]/50 focus:outline-none focus:border-[#79C043]"
            />
          </div>

          <div className="flex gap-2 font-mono text-xs">
            {["All", "Full-Time", "Internship"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-2 rounded-xl transition ${
                  filterType === t
                    ? "bg-[#79C043] text-[#131417] font-bold"
                    : "bg-[#1C1E22] text-[#8D9099] hover:text-[#ECE8E1] border border-[rgba(236,232,225,0.1)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Drives Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDrives.map((drive) => (
            <div
              key={drive.id}
              className="bg-[#1C1E22] border border-[rgba(236,232,225,0.12)] hover:border-[rgba(236,232,225,0.25)] p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 transition"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#131417] text-[#79C043] border border-[rgba(121,192,67,0.2)] font-bold uppercase">
                      {drive.type}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-[#ECE8E1] mt-2">
                      {drive.role}
                    </h3>
                    <p className="text-sm font-mono text-[#79C043] font-semibold mt-0.5 flex items-center gap-1.5">
                      <Building size={14} /> {drive.company}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-[#8D9099] block">
                      Compensation
                    </span>
                    <span className="font-display text-lg sm:text-xl font-bold text-[#ECE8E1]">
                      {drive.compensation}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#8D9099] leading-relaxed">
                  {drive.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {drive.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-[#131417] text-[#ECE8E1] border border-[rgba(236,232,225,0.08)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Meta list */}
                <div className="pt-4 border-t border-[rgba(236,232,225,0.08)] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#8D9099]">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#79C043]" />
                    <span>{drive.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap size={13} className="text-[#79C043]" />
                    <span className="truncate">{drive.eligibility}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#8D9099]" />
                    <span>Deadline: {drive.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(236,232,225,0.1)] flex justify-between items-center">
                <button
                  onClick={() => handleApply(drive)}
                  className="w-full py-3 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs uppercase font-bold tracking-wider transition flex items-center justify-center gap-2"
                >
                  <span>Submit Application</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Placements;
