import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToDashboard from "../components/BackToDashboard";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Plus,
  MapPin,
  Phone,
  CheckCircle2,
  RotateCcw,
  Trash2,
  X,
  AlertCircle,
  HelpCircle,
  Package,
} from "lucide-react";

function LostFound() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [itemType, setItemType] = useState("Lost");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    contact: "",
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lost-found");
      if (res.data?.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error("Failed to load lost & found:", err);
      setError("Failed to load lost & found records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openForm = (type) => {
    setItemType(type);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({ name: "", description: "", location: "", contact: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const res = await API.post("/lost-found", {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        type: itemType,
        contact: formData.contact || user?.email,
      });

      if (res.data?.success) {
        setItems([res.data.item, ...items]);
        closeForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Resolved" ? "Open" : "Resolved";
    try {
      const res = await API.patch(`/lost-found/${id}/status`, { status: nextStatus });
      if (res.data?.success) {
        setItems(
          items.map((i) => (i._id === id ? { ...i, status: nextStatus } : i))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await API.delete(`/lost-found/${id}`);
      if (res.data?.success) {
        setItems(items.filter((i) => i._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete report.");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesFilter = filterType === "All" || item.type === filterType;
    const matchesSearch = `${item.name} ${item.description} ${item.location}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
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
              06 // CAMPUS REGISTRY
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-[#ECE8E1] mt-2">
              LOST & FOUND REPOSITORY.
            </h1>
            <p className="text-sm text-[#8D9099] mt-2">
              Report missing items or surrender found belongings across campus.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => openForm("Lost")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/40 text-red-400 font-mono text-xs uppercase tracking-wider font-bold transition"
            >
              <HelpCircle size={15} />
              <span>Report Lost</span>
            </button>
            <button
              onClick={() => openForm("Found")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs uppercase tracking-wider font-bold transition"
            >
              <Package size={15} />
              <span>Report Found</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono p-4 rounded-xl mb-6 flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Report Form Modal */}
        {showForm && (
          <div className="bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] p-6 sm:p-8 rounded-2xl mb-10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-2xl font-black text-[#ECE8E1]">
                REPORT {itemType.toUpperCase()} ITEM
              </h3>
              <button onClick={closeForm} className="text-[#8D9099] hover:text-[#ECE8E1]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Blue Titan Octane Chronograph Watch"
                  required
                  className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                  Description & Identifiers *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Include identifying marks, color, model, scratches, time found/lost..."
                  required
                  rows={3}
                  className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                    Location On Campus *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Central Library 2nd Floor"
                    required
                    className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                    Contact Phone / Email
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder={user?.email || "Contact detail"}
                    className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(236,232,225,0.1)]">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-2.5 rounded-xl bg-[#131417] text-xs font-mono uppercase text-[#8D9099]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs uppercase font-bold tracking-wider"
                >
                  {submitLoading ? "Submitting..." : `Submit ${itemType} Record`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D9099]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports by item name, description, or campus location..."
              className="w-full bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-[#ECE8E1] placeholder:text-[#8D9099]/50 focus:outline-none focus:border-[#79C043]"
            />
          </div>

          <div className="flex gap-2 font-mono text-xs">
            {["All", "Lost", "Found"].map((t) => (
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

        {/* Reports Grid */}
        {loading ? (
          <div className="text-center py-16 font-mono text-xs text-[#8D9099]">
            <span className="w-2 h-2 rounded-full bg-[#79C043] animate-ping inline-block mr-2" />
            Loading registry from MongoDB Atlas...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isReporter =
                  user &&
                  (item.reportedBy === user._id ||
                    item.reportedBy?._id === user._id ||
                    user.role === "admin");

                const isResolved = item.status === "Resolved";

                return (
                  <div
                    key={item._id}
                    className={`bg-[#1C1E22] border p-6 rounded-2xl flex flex-col justify-between transition ${
                      isResolved
                        ? "border-[rgba(236,232,225,0.06)] opacity-70"
                        : "border-[rgba(236,232,225,0.12)] hover:border-[rgba(236,232,225,0.25)]"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <span
                          className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                            item.type === "Lost"
                              ? "bg-red-950/40 text-red-400 border border-red-500/30"
                              : "bg-[rgba(121,192,67,0.15)] text-[#79C043] border border-[#79C043]/30"
                          }`}
                        >
                          {item.type}
                        </span>

                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            isResolved
                              ? "bg-[#131417] text-[#8D9099]"
                              : "bg-[#79C043]/10 text-[#79C043] font-bold"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold text-[#ECE8E1] mt-2">
                        {item.name}
                      </h3>

                      <p className="text-xs text-[#8D9099] mt-2 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[rgba(236,232,225,0.08)] space-y-1.5 font-mono text-[11px] text-[#8D9099]">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-[#79C043]" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-[#8D9099]" />
                          <span>Contact: {item.contact || "Campus Security"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[rgba(236,232,225,0.1)] flex items-center justify-between">
                      {isReporter ? (
                        <button
                          onClick={() => handleToggleStatus(item._id, item.status)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition ${
                            isResolved
                              ? "bg-[#131417] hover:bg-[#26292E] text-[#ECE8E1] border border-[rgba(236,232,225,0.15)]"
                              : "bg-[#79C043] hover:bg-[#8ade4e] text-[#131417]"
                          }`}
                        >
                          {isResolved ? (
                            <>
                              <RotateCcw size={12} />
                              <span>Reopen</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={12} />
                              <span>Mark Resolved</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-[#8D9099]">
                          Reported by: {item.reporterName || "Student"}
                        </span>
                      )}

                      {isReporter && (
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 rounded-lg hover:bg-red-950/40 text-[#8D9099] hover:text-red-400 transition"
                          title="Delete report"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center bg-[#1C1E22] rounded-2xl border border-[rgba(236,232,225,0.1)] font-mono text-xs text-[#8D9099]">
                No reports matching the selected criteria.
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default LostFound;
