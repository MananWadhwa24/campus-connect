import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const token = localStorage.getItem("token");

  if (loading && token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131417] text-[#ECE8E1]">
        <div className="text-center font-mono text-xs text-[#8D9099]">
          <div className="w-8 h-8 border-2 border-[#79C043] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Verifying secure session token...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
