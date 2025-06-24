
import { Navigate } from "react-router-dom";
import { useAuth } from "@/App";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default Index;
