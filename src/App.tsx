import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import VenueOwners from "./pages/VenueOwners";
import Venues from "./pages/Venues";
import Bookings from "./pages/Bookings";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <NavBar />
                  <Dashboard />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <>
                  <NavBar />
                  <Users />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/venue-owners"
            element={
              <ProtectedRoute>
                <>
                  <NavBar />
                  <VenueOwners />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/venues"
            element={
              <ProtectedRoute>
                <>
                  <NavBar />
                  <Venues />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <>
                  <NavBar />
                  <Bookings />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <>
                  <NavBar />
                  <Analytics />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
