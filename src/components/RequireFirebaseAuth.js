import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Loading from "../reusable/loading";

const RequireFirebaseAuth = () => {
  const { authUser } = useAuth();
  const location = useLocation();
  if (authUser === undefined) return <Loading />;

  return authUser ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};
export default RequireFirebaseAuth;
