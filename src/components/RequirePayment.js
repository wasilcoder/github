import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/setup";
import Loading from "../reusable/loading";

const RequirePayment = () => {
  const { authUser } = useAuth();
  const location = useLocation();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getDoc(doc(db, "users", authUser.email))
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const status = data.status;
          setStatus(status);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (status) setLoading(false);
  }, [status]);

  if (loading) return <Loading />;
  return status === "paid" || status === "trial" ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/subscription" state={{ from: location }} replace />
  );
};
export default RequirePayment;
