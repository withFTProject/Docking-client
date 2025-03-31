import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("✅ 버튼 클릭됨"); // ← 이게 터미널에 보이면 진짜 여기 실행된 것!
    navigate("/after-login");
  };
  

  return (
    <div style={styles.container}>
      <img src="/logo.png" alt="logo" style={styles.logo} />
      <button onClick={handleLogin} style={styles.kakaoButton}>
        <img src="/kakao_icon.png" alt="카카오 아이콘" style={styles.kakaoIcon} />
        카카오 로그인
      </button>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "380px",
    marginBottom: "55px",
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  kakaoIcon: {
    width: "20px",
    height: "20px",
  },
};

export default Login;



