
import React from "react";
import { Routes, Route } from "react-router-dom";
import { SignUp } from "./SignUp";
import { Home } from "./Home"; // protected page
import { PrivateRoute } from "./routes/PrivateRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};
