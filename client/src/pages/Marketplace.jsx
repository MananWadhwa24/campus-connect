import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToDashboard from "../components/BackToDashboard";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingBag,
  Plus,
  Search,
  Tag,
  MapPin,
  Phone,
  User,
  Trash2,
  X,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

function Marketplace() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
    category: "Books & Study",
    contact: "",
  });

  const categories = [
    "All",
    "Books & Study",
    "Electronics",
    "Lab Equipment",
    "Calculators & Tools",
    "General",
  ];

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/marketplace");
      if (res.data?.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error("Failed to load marketplace:", err);
      setError("Failed to load marketplace listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const res = await API.post("/marketplace", {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        location: formData.location,
        category: formData.category,
        contact: formData.contact || user?.email,
      });

      if (res.data?.success) {
        setItems([res.data.item, ...items]);
        setFormData({
          name: "",
          description: "",
          price: "",
          location: "",
          category: "Books & Study",
          contact: "",
        });
        setShowForm(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish listing.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      const res = await API.delete(`/marketplace/${id}`);
      if (res.data?.success) {
        setItems(items.filter((item) => item._id !== id));
        if (selectedItem?._id === id) setSelectedItem(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete item.");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = `${item.name} ${item.description} ${item.location}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
              03 // CAMPUS COMMERCE
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-[#ECE8E1] mt-2">
              STUDENT MARKETPLACE.
            </h1>
            <p className="text-sm text-[#8D9099] mt-2">
              Peer-to-peer exchange for textbooks, drafting kits, lab equipment, and electronics.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs uppercase tracking-widest font-bold transition shadow-md"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            <span>{showForm ? "Cancel" : "Post Item for Sale"}</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono p-4 rounded-xl mb-6 flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Create Listing Form */}
        {showForm && (
          <div className="bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] p-6 sm:p-8 rounded-2xl mb-10 shadow-2xl">
            <h3 className="font-display text-2xl font-black text-[#ECE8E1] mb-6">
              POST ITEM TO CAMPUS MARKET
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Casio fx-991EX ClassWiz"
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
                    {categories.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                  Item Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the condition, semester used, defects, and accessories included..."
                  required
                  rows={3}
                  className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="850"
                    required
                    className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Boys Hostel 2, Gate 1"
                    required
                    className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#8D9099] mb-1.5">
                    Contact Phone / Info
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder={user?.email || "Phone or email"}
                    className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                  />
                </div>
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
                  {submitLoading ? "Publishing..." : "Publish Item"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D9099]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search listings by title, description, or pickup location..."
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

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-16 font-mono text-xs text-[#8D9099]">
            <span className="w-2 h-2 rounded-full bg-[#79C043] animate-ping inline-block mr-2" />
            Loading active listings from MongoDB Atlas...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isOwner =
                  user &&
                  (item.seller === user._id ||
                    item.seller?._id === user._id ||
                    user.role === "admin");

                return (
                  <div
                    key={item._id}
                    className="bg-[#1C1E22] border border-[rgba(236,232,225,0.12)] hover:border-[rgba(236,232,225,0.25)] p-6 rounded-2xl flex flex-col justify-between transition"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#131417] text-[#79C043] border border-[rgba(121,192,67,0.2)] font-bold uppercase">
                          {item.category || "General"}
                        </span>
                        <span className="font-display text-2xl font-black text-[#79C043]">
                          ₹{item.price}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold text-[#ECE8E1] mt-2">
                        {item.name}
                      </h3>

                      <p className="text-xs text-[#8D9099] mt-2 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[rgba(236,232,225,0.08)] space-y-1.5 font-mono text-[11px] text-[#8D9099]">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-[#79C043]" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-[#8D9099]" />
                          <span>Seller: {item.sellerName || "Student"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[rgba(236,232,225,0.1)] flex items-center justify-between">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-4 py-2 rounded-lg bg-[#131417] hover:bg-[#26292E] border border-[rgba(236,232,225,0.15)] text-xs font-mono uppercase text-[#ECE8E1] font-bold transition"
                      >
                        Details & Contact
                      </button>

                      {isOwner && (
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 rounded-lg hover:bg-red-950/40 text-[#8D9099] hover:text-red-400 transition"
                          title="Delete listing"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center bg-[#1C1E22] rounded-2xl border border-[rgba(236,232,225,0.1)] font-mono text-xs text-[#8D9099]">
                No items match your criteria. Click "Post Item for Sale" to add one!
              </div>
            )}
          </div>
        )}

        {/* Details & Contact Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1C1E22] border border-[rgba(236,232,225,0.2)] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs uppercase text-[#79C043] font-bold">
                    {selectedItem.category}
                  </span>
                  <h3 className="font-display text-2xl font-black text-[#ECE8E1] mt-1">
                    {selectedItem.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-lg hover:bg-[#131417] text-[#8D9099] hover:text-[#ECE8E1]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-[#131417] p-4 rounded-xl border border-[rgba(236,232,225,0.1)]">
                <span className="text-xs font-mono text-[#8D9099]">Listed Price</span>
                <p className="font-display text-3xl font-black text-[#79C043]">
                  ₹{selectedItem.price}
                </p>
              </div>

              <p className="text-sm text-[#8D9099] leading-relaxed whitespace-pre-wrap">
                {selectedItem.description}
              </p>

              <div className="p-4 bg-[#131417] rounded-xl border border-[rgba(236,232,225,0.1)] space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#79C043]" />
                  <span>
                    <strong className="text-[#ECE8E1]">Location:</strong> {selectedItem.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-[#79C043]" />
                  <span>
                    <strong className="text-[#ECE8E1]">Seller:</strong> {selectedItem.sellerName || "Student"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#79C043]" />
                  <span>
                    <strong className="text-[#ECE8E1]">Contact:</strong> {selectedItem.contact}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-3 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs uppercase font-bold tracking-widest"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Marketplace;
