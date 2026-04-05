import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import Loader from "@/components/ui/Loader";

const ProtectedRoute = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="shell-loader">
        <Loader label="Checking your studio session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
