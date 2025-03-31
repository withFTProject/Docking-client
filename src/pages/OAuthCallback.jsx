import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/after-login");
  }, [navigate]); // ✅ 이렇게 하면 경고 사라짐!

  return <div>카카오 로그인 중입니다...</div>;
};

export default OAuthCallback;
