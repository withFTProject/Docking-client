import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AfterLogin from "./pages/AfterLogin";
import OAuthCallback from "./pages/OAuthCallback";
import WriteLetter from "./pages/WriteLetter";
import SelectPlanet from "./pages/SelectPlanet";
import SolarSystem from "./pages/SolarSystem";
import LoginFail from "./pages/LoginFail"; // 로그인 실패 페이지

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />                  // 메인(로그인) 페이지
        <Route path="/after-login" element={<AfterLogin />} /> // 로그인 후 화면
        <Route path="/oauth2/redirect" element={<OAuthCallback />} /> // 백엔드에서 redirect되는 경로
        <Route path="/write-letter" element={<WriteLetter />} />      // 편지 작성
        <Route path="/select-planet" element={<SelectPlanet />} />    // 행성 선택
        <Route path="/solar-system" element={<SolarSystem />} />      // 태양계 화면
        <Route path="/login-fail" element={<LoginFail />} />          // 로그인 실패 시
      </Routes>
    </Router>
  );
}

export default App;
