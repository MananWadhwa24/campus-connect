import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToDashboard from "../components/BackToDashboard";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  Plus,
  Search,
  Trash2,
  Calendar,
  X,
  AlertCircle,
  Tag,
  CheckCircle,
} from "lucide-react";

function Notices() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Important",
    description: "",
  });

  const categories = [
    "All",
    "Important",
    "Exam",
    "Placement",
    "Event",
    "General",
  ];

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notices");
      if (res.data?.success) {
        setNotices(res.data.notices);
      }
    } catch (err) {
      console.error("Failed to load notices:", err);
      setError("Failed to load notices from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const res = await API.post("/notices", formData);
      if (res.data?.success) {
        setNotices([res.data.notice, ...notices]);
        setFormData({
          title: "",
          category: "Important",
          description: "",
        });
        setShowForm(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish notice.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      const res = await API.delete(`/notices/${id}`);
      if (res.data?.success) {
        setNotices(notices.filter((n) => n._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete notice.");
    }
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch = `${n.title} ${n.description}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "All" || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#131417] text-[#ECE8E1] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <BackToDashboard />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 pb-6 border-b border-[rgba(236,232,225,0.12)]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#79C043] font-bold">
              04 // OFFICIAL BULLETINS
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-[#ECE8E1] mt-2">
              CAMPUS NOTICES.
            </h1>
            <p className="text-sm text-[#8D9099] mt-2">
              Official circulars, examination schedules, and event announcements.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs uppercase tracking-widest font-bold transition shadow-md"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            <span>{showForm ? "Cancel" : "Publish Notice"}</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono p-4 rounded-xl mb-6 flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Publish Form */}
        {showForm && (
          <div className="bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] p-6 sm:p-8 rounded-2xl mb-10 shadow-2xl">
            <h3 className="font-display text-2xl font-black text-[#ECE8E1] mb-6">
              ISSUE CAMPUS NOTICE
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                  Notice Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. End-Semester Examination Schedule Declared"
                  required
                  className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                >
                  <option value="Important">Important</option>
                  <option value="Exam">Exam</option>
                  <option value="Placement">Placement</option>
                  <option value="Event">Event</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                  Detailed Notice Text *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Write the complete notice announcement, instructions, and deadlines..."
                  required
                  rows={5}
                  className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(236,232,225,0.1)]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#131417] text-xs font-mono uppercase text-[#8D9099]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs uppercase font-bold tracking-wider"
                >
                  {submitLoading ? "Publishing..." : "Publish Bulletin"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D9099]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search circulars by keyword..."
              className="w-full bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-[#ECE8E1] placeholder:text-[#8D9099]/50 focus:outline-none focus:border-[#79C043]"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl transition ${
                  selectedCategory === cat
                    ? "bg-[#79C043] text-[#131417] font-bold"
                    : "bg-[#1C1E22] text-[#8D9099] hover:text-[#ECE8E1] border border-[rgba(236,232,225,0.1)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Stream */}
        {loading ? (
          <div className="text-center py-16 font-mono text-xs text-[#8D9099]">
            <span className="w-2 h-2 rounded-full bg-[#79C043] animate-ping inline-block mr-2" />
            Loading circulars from MongoDB Atlas...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => {
                const isAuthor =
                  user &&
                  (notice.postedBy === user._id ||
                    notice.postedBy?._id === user._id ||
                    user.role === "admin" ||
                    user.role === "faculty");

                const isImportant = notice.category === "Important";

                return (
                  <div
                    key={notice._id}
                    className={`bg-[#1C1E22] border p-6 sm:p-7 rounded-2xl transition space-y-4 ${
                      isImportant
                        ? "border-[#79C043]/40 bg-[#1C1E22]/90"
                        : "border-[rgba(236,232,225,0.12)]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                              isImportant
                                ? "bg-[rgba(121,192,67,0.15)] text-[#79C043] border border-[#79C043]/30"
                                : "bg-[#131417] text-[#ECE8E1] border border-[rgba(236,232,225,0.1)]"
                            }`}
                          >
                            {notice.category}
                          </span>
                          <span className="text-xs font-mono text-[#8D9099]">
                            {new Date(notice.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#ECE8E1]">
                          {notice.title}
                        </h3>
                      </div>

                      {isAuthor && (
                        <button
                          onClick={() => handleDelete(notice._id)}
                          className="p-2 rounded-lg hover:bg-red-950/40 text-[#8D9099] hover:text-red-400 transition"
                          title="Delete notice"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-[#8D9099] leading-relaxed whitespace-pre-wrap">
                      {notice.description}
                    </p>

                    <div className="pt-4 border-t border-[rgba(236,232,225,0.08)] flex justify-between items-center text-[11px] font-mono text-[#8D9099]/70">
                      <span>Authority: {notice.authorName || "Campus Administration"}</span>
                      <span className="flex items-center gap-1 text-[#79C043]">
                        <CheckCircle size={12} /> Verified Bulletin
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center bg-[#1C1E22] rounded-2xl border border-[rgba(236,232,225,0.1)] font-mono text-xs text-[#8D9099]">
                No notices published in this category.
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Notices;
