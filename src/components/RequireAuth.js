import { useLocation, Navigate, Outlet } from "react-router-dom";
import "../firebase/setup";
import { useEffect, useState } from "react";

const RequireAuth = () => {
  const token1 = localStorage.getItem("token");
  const token2 = localStorage.getItem("qbToken");

  const location = useLocation();

  return token1 && token2 ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
