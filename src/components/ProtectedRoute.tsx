import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

export const ProtectedRoute = ({ layout }: { layout: React.ReactNode }) => {
  const { user } = useUserContext();

  if (!user) return <Navigate to={"/login"} replace />;

  return layout;
};
