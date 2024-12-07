import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Party from "./pages/Party";
import Color from "./pages/Color";
import RouteManagement from "./pages/RouteManagement";
import Inventory from "./pages/Inventory";
import Report from "./pages/Report";
import Orders from "./pages/Orders";
import SubAdmin from "./pages/SubAdmin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
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

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="party" element={<Party />} />
          <Route path="color" element={<Color />} />
          <Route path="route" element={<RouteManagement />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="report" element={<Report />} />
          <Route path="orders" element={<Orders />} />
          <Route path="subadmin" element={<SubAdmin />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
