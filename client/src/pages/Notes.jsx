import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToDashboard from "../components/BackToDashboard";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { jsPDF } from "jspdf";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Search,
  Plus,
  X,
  FileCheck,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Eye,
  Printer,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";

function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // In-App PDF Viewer Modal State
  const [previewNote, setPreviewNote] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    semester: "Semester 3",
    branch: "CSE",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const host =
    typeof window !== "undefined" && window.location.hostname
      ? window.location.hostname
      : "localhost";

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notes");
      if (res.data?.success) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error("Failed to load notes:", err);
      setError("Failed to load notes from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleFileChange = (e) => {
    setFileError("");
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setFileError("Only valid PDF files (.pdf) are allowed.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFileError("PDF file size cannot exceed 15 MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subject", formData.subject || formData.title);
      data.append("description", formData.description);
      data.append("semester", formData.semester);
      data.append("branch", formData.branch);

      if (selectedFile) {
        data.append("file", selectedFile);
      }

      const res = await API.post("/notes", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        setNotes([res.data.note, ...notes]);
        setFormData({
          title: "",
          subject: "",
          description: "",
          semester: "Semester 3",
          branch: "CSE",
        });
        setSelectedFile(null);
        setShowForm(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish note.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note and its associated PDF?")) {
      return;
    }

    try {
      const res = await API.delete(`/notes/${id}`);
      if (res.data?.success) {
        setNotes(notes.filter((n) => n._id !== id));
        if (previewNote?._id === id) setPreviewNote(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete note.");
    }
  };

  // Export note metadata and contents as a clean formatted PDF
  const handleExportPDF = (note) => {
    try {
      const doc = new jsPDF();

      // Header Banner
      doc.setFillColor(19, 20, 23); // #131417
      doc.rect(0, 0, 210, 36, "F");

      doc.setTextColor(121, 192, 69); // #79C043
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("CAMPUS CONNECT // ACADEMIC NOTES", 14, 18);

      doc.setTextColor(236, 232, 225); // #ECE8E1
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Verified College Resource Management Archive", 14, 28);

      // Note Metadata Section
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(note.title, 14, 50);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Subject: ${note.subject || note.title}`, 14, 60);
      doc.text(`Semester: ${note.semester}  |  Branch: ${note.branch}`, 14, 66);
      doc.text(
        `Uploaded By: ${note.uploaderName || "Student"}  |  Date: ${
          note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "Recent"
        }`,
        14,
        72
      );

      // Divider Line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 78, 196, 78);

      // Description Body
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Description & Syllabus Topics:", 14, 90);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitDesc = doc.splitTextToSize(note.description, 182);
      doc.text(splitDesc, 14, 100);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(
        "Generated via Campus Connect Portal • Verified Academic Material",
        14,
        285
      );

      doc.save(`${note.title.replace(/[^a-zA-Z0-9]/g, "_")}_Notes.pdf`);
    } catch (exportErr) {
      console.error("PDF export error:", exportErr);
      alert("Failed to export note as PDF: " + exportErr.message);
    }
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = `${n.title} ${n.description} ${n.subject || ""} ${n.branch} ${n.semester}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesBranch = selectedBranch === "All" || n.branch === selectedBranch;
    const matchesSemester = selectedSemester === "All" || n.semester === selectedSemester;
    return matchesSearch && matchesBranch && matchesSemester;
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
              01 // RESOURCE MANAGEMENT
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-[#ECE8E1] mt-2">
              STUDY NOTES & PDF LIBRARY.
            </h1>
            <p className="text-sm text-[#8D9099] mt-2">
              Import, preview, and download academic notes and course materials stored in MongoDB Atlas.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs uppercase tracking-widest font-bold transition shadow-md"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            <span>{showForm ? "Cancel" : "Add Note / Upload PDF"}</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono p-4 rounded-xl mb-6 flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Form Modal / Drawer */}
        {showForm && (
          <div className="bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] p-6 sm:p-8 rounded-2xl mb-10 shadow-2xl">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-[rgba(236,232,225,0.1)]">
              <div>
                <h3 className="font-display text-2xl font-black text-[#ECE8E1]">
                  UPLOAD COURSE NOTES
                </h3>
                <p className="text-xs font-mono text-[#8D9099]">
                  Supports direct PDF upload (up to 15MB) with in-app preview
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-[#8D9099] hover:text-[#ECE8E1]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8D9099] mb-1.5">
                    Note / Subject Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Distributed Operating Systems"
                    required
                    className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8D9099] mb-1.5">
                    Subject Code / Name
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. CS-502 Operating Systems"
                    className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8D9099] mb-1.5">
                  Detailed Description & Syllabus Topics Covered *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline key concepts, formulas, and chapters included in this resource..."
                  required
                  rows={4}
                  className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8D9099] mb-1.5">
                    Semester *
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={`Semester ${s}`}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8D9099] mb-1.5">
                    Academic Branch *
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-[#131417] border border-[rgba(236,232,225,0.15)] rounded-xl p-3 text-sm text-[#ECE8E1] focus:outline-none focus:border-[#79C043] font-mono"
                  >
                    {["CSE", "IT", "ECE", "EE", "ME", "CE", "AI/ML", "General"].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PDF File Upload Zone */}
              <div className="bg-[#131417] border border-dashed border-[rgba(236,232,225,0.2)] rounded-xl p-6 text-center space-y-3">
                <Upload size={28} className="mx-auto text-[#79C043]" />
                <div>
                  <label className="cursor-pointer text-sm font-mono text-[#79C043] font-bold hover:underline">
                    <span>Select PDF Document</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-[#8D9099] font-mono mt-1">
                    Maximum allowed file size: 15 MB
                  </p>
                </div>

                {selectedFile && (
                  <div className="inline-flex items-center gap-2 bg-[#1C1E22] border border-[#79C043]/40 px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#ECE8E1]">
                    <FileCheck size={14} className="text-[#79C043]" />
                    <span>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-[#8D9099] hover:text-red-400 ml-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {fileError && (
                  <p className="text-xs text-red-400 font-mono">{fileError}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(236,232,225,0.1)]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#131417] text-xs font-mono uppercase text-[#8D9099] hover:text-[#ECE8E1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs uppercase font-bold tracking-wider transition disabled:opacity-50"
                >
                  {submitLoading ? "Publishing to Atlas..." : "Publish Note to Atlas"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D9099]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes by subject, title, or keywords..."
              className="w-full bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-[#ECE8E1] placeholder:text-[#8D9099]/50 focus:outline-none focus:border-[#79C043]"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] rounded-xl px-3 py-2 text-[#ECE8E1] focus:outline-none focus:border-[#79C043]"
            >
              <option value="All">All Branches</option>
              {["CSE", "IT", "ECE", "EE", "ME", "CE", "AI/ML"].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] rounded-xl px-3 py-2 text-[#ECE8E1] focus:outline-none focus:border-[#79C043]"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={`Semester ${s}`}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-16 font-mono text-xs text-[#8D9099]">
            <span className="w-2 h-2 rounded-full bg-[#79C043] animate-ping inline-block mr-2" />
            Loading notes from MongoDB Atlas...
          </div>
        )}

        {/* Notes Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => {
                const isOwner =
                  user &&
                  (note.uploadedBy === user._id ||
                    note.uploadedBy?._id === user._id ||
                    user.role === "admin");

                const fullPdfUrl = note.fileUrl ? `http://${host}:5000${note.fileUrl}` : null;

                return (
                  <div
                    key={note._id}
                    className="bg-[#1C1E22] border border-[rgba(236,232,225,0.12)] hover:border-[rgba(236,232,225,0.25)] p-6 rounded-2xl flex flex-col justify-between transition"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-4">
                        <span className="font-mono text-[10px] px-2.5 py-1 rounded-md bg-[#131417] text-[#79C043] border border-[rgba(121,192,67,0.2)] font-bold uppercase">
                          {note.branch}
                        </span>
                        <span className="font-mono text-[10px] text-[#8D9099]">
                          {note.semester}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold text-[#ECE8E1] leading-snug">
                        {note.title}
                      </h3>

                      <p className="text-xs font-mono text-[#8D9099] mt-1">
                        {note.subject || "General Study"}
                      </p>

                      <p className="text-xs text-[#8D9099] mt-3 line-clamp-3 leading-relaxed">
                        {note.description}
                      </p>

                      <div className="pt-4 mt-4 border-t border-[rgba(236,232,225,0.08)] flex items-center justify-between text-[11px] font-mono text-[#8D9099]/70">
                        <span className="flex items-center gap-1">
                          <User size={12} /> {note.uploaderName || "Student"}
                        </span>
                        {note.fileUrl ? (
                          <span className="text-[#79C043] font-bold flex items-center gap-1">
                            <FileCheck size={12} /> PDF Attached
                          </span>
                        ) : (
                          <span className="text-[#8D9099]">Text Note</span>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-6 pt-4 border-t border-[rgba(236,232,225,0.1)] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {note.fileUrl ? (
                          <button
                            onClick={() => {
                              setZoomLevel(100);
                              setPreviewNote(note);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-[11px] font-bold uppercase transition"
                          >
                            <Eye size={12} />
                            <span>Preview PDF</span>
                          </button>
                        ) : null}

                        <button
                          onClick={() => handleExportPDF(note)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#131417] hover:bg-[#26292E] border border-[rgba(236,232,225,0.15)] text-[#ECE8E1] font-mono text-[11px] transition"
                          title="Export as Printable PDF"
                        >
                          <Printer size={12} />
                          <span>Export</span>
                        </button>
                      </div>

                      {isOwner && (
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="p-1.5 rounded-lg hover:bg-red-950/40 text-[#8D9099] hover:text-red-400 transition"
                          title="Delete note"
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
                No notes match your filters. Click "Add Note / Upload PDF" to create one.
              </div>
            )}
          </div>
        )}

        {/* IN-APP PDF VIEWER MODAL */}
        {previewNote && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
            <div className="bg-[#1C1E22] border border-[rgba(236,232,225,0.2)] rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              {/* Viewer Header & Controls */}
              <div className="p-4 bg-[#131417] border-b border-[rgba(236,232,225,0.12)] flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-[#79C043]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#ECE8E1] font-display">
                      {previewNote.title}
                    </h4>
                    <span className="text-[10px] font-mono text-[#8D9099]">
                      {previewNote.fileName || "Course Document.pdf"}
                    </span>
                  </div>
                </div>

                {/* Toolbar controls */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                    className="p-2 rounded-lg bg-[#1C1E22] hover:bg-[#26292E] border border-[rgba(236,232,225,0.15)] text-[#ECE8E1]"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="text-[11px] text-[#8D9099] w-12 text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                    className="p-2 rounded-lg bg-[#1C1E22] hover:bg-[#26292E] border border-[rgba(236,232,225,0.15)] text-[#ECE8E1]"
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>

                  <a
                    href={`http://${host}:5000${previewNote.fileUrl}`}
                    download={previewNote.fileName || "Note.pdf"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-bold text-xs uppercase"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>

                  <button
                    onClick={() => setPreviewNote(null)}
                    className="p-2 rounded-lg bg-[#1C1E22] hover:bg-red-950/40 text-[#8D9099] hover:text-red-400 border border-[rgba(236,232,225,0.15)] ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* PDF Container */}
              <div className="flex-1 bg-[#0D0E11] overflow-auto p-4 flex items-center justify-center">
                <div
                  style={{
                    width: `${zoomLevel}%`,
                    height: "100%",
                    transition: "width 0.2s ease-out",
                  }}
                  className="mx-auto"
                >
                  <iframe
                    src={`http://${host}:5000${previewNote.fileUrl}`}
                    title={previewNote.title}
                    className="w-full h-full rounded-xl border border-[rgba(236,232,225,0.1)] shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Notes;
