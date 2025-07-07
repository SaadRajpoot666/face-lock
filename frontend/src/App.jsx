import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { AuthProvider } from "./context/UserContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
