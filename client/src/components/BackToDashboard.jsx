import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BackToDashboard() {
  return (
    <div className="mb-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8D9099] hover:text-[#79C043] transition group"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
}

export default BackToDashboard;
