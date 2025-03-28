
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 성공 시 쿠키 확인
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("Authorization="));

    if (token) {
      navigate("/after-login");
    }
  }, []);

  return <div>로그인 처리 중...</div>;
};

export default OAuthCallback;
