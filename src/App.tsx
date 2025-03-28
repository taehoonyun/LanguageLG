import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Layout from "./layouts";
import { withAuth } from "./middleware/auth";

const ProtectedMain = withAuth(Main);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="main" element={<ProtectedMain />} />
          <Route index element={<Navigate to="/main" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
