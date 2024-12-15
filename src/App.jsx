import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import NewOrderPartySelection from "./pages/orders/new";
import OrderForm from "./pages/orders/new/form";
import Party from "./pages/Party";
import Color from "./pages/Color";
import RouteManagement from "./pages/RouteManagement";
import SubAdmin from "./pages/SubAdmin";
import Inventory from "./pages/Inventory";
import Report from "./pages/Report";
import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<NewOrderPartySelection />} />
          <Route path="orders/new/form" element={<OrderForm />} />
          <Route path="party" element={<Party />} />
          <Route path="color" element={<Color />} />
          <Route path="route" element={<RouteManagement />} />
          <Route path="sub-admin" element={<SubAdmin />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="report" element={<Report />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
