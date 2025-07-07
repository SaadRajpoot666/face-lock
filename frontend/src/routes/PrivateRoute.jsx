import { Navigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";

export const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signup" />;
};
