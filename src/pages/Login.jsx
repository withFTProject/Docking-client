import React from "react";

const Login = () => {
  const BACKEND_KAKAO_LOGIN_URL = "http://localhost:8085/oauth2/authorization/kakao";

  const handleLogin = () => {
    window.location.href = BACKEND_KAKAO_LOGIN_URL;
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
    width: "380px",         // 로켓 이미지 크기 키움 (기존 240px → 300px)
    marginBottom: "55px",   // 로켓과 버튼 사이 간격 크게 (기존 30px → 60px)
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


