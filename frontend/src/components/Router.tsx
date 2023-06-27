import { useAuth } from "../context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Layout from "./Layout";

// component responsible for returning auth based or public routes
function RoutesComponent() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return (
      <Routes>
        <Route
          index
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <RoutesComponent />
    </BrowserRouter>
  );
}
