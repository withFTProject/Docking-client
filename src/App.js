import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AfterLogin from "./pages/AfterLogin";
import WriteLetter from "./pages/WriteLetter";
import OAuthCallback from "./pages/OAuthCallback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/oauth/callback/kakao" element={<OAuthCallback />} />
        <Route path="/after-login" element={<AfterLogin />} />
        <Route path="/write" element={<WriteLetter />} />
      </Routes>
    </Router>
  );
}

export default App;

