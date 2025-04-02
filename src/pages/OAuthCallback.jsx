// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const OAuthCallback = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     navigate("/after-login");
//   }, [navigate]); // ✅ 이렇게 하면 경고 사라짐!

//   return <div>카카오 로그인 중입니다...</div>;
// };

// export default OAuthCallback;
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL에서 토큰 파라미터 확인
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      // 토큰이 URL에 있으면 저장
      localStorage.setItem("token", token);
      console.log("✅ 토큰 저장됨 (OAuthCallback):", token);
    }

    navigate("/after-login" + location.search);
  }, [navigate, location]);

  return <div>카카오 로그인 중입니다...</div>;
};

export default OAuthCallback;