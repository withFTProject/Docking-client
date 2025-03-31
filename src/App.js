import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AfterLogin from "./pages/AfterLogin";
import WriteLetter from "./pages/WriteLetter";
import OAuthCallback from "./pages/OAuthCallback"; // ✅ 이거 꼭 필요함
import SelectPlanet from "./pages/SelectPlanet"; 
import SolarSystem from "./pages/SolarSystem"; 

function App() {
  console.log("App loaded"); 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/oauth/callback/kakao" element={<OAuthCallback />} /> {/* ✅ 이 라우트도 필요 */}
        <Route path="/after-login" element={<AfterLogin />} />
        <Route path="/write" element={<WriteLetter />} />
        <Route path="/select-planet" element={<SelectPlanet />} />
        <Route path="/solar-system" element={<SolarSystem />} />
        <Route path="/write-letter" element={<WriteLetter />} />

      </Routes>
    </Router>
  );
}

export default App;

