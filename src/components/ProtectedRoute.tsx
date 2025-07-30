import React, { useContext } from "react";
import { SupabaseUserContext } from "../context/SupabaseUserContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ layout }: { layout: React.ReactNode }) => {
  const { user } = useContext(SupabaseUserContext);

  if (!user) return <Navigate to={"/login"} replace />;

  return layout;
};
