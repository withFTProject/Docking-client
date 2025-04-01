import React from "react";

const Login = () => {
  const handleLogin = () => {
    // ✅ 카카오 로그인 URL로 리디렉션
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  return (
    <div style={styles.wrapper}>
      <img src="/logo.png" alt="logo" style={styles.logo} />
      <button style={styles.kakaoButton} onClick={handleLogin}>
        <img src="/kakao_icon.png" alt="카카오 아이콘" style={styles.icon} />
        카카오 로그인
      </button>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center", // ✅ 수직 수평 가운데 정렬
    backgroundColor: "white",
  },
  logo: {
    width: "320px",
    marginBottom: "40px",
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
  },
  icon: {
    width: "20px",
    height: "20px",
  },
};

export default Login;
