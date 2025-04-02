import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AfterLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 쿠키에서 토큰 읽기
    const cookies = document.cookie.split(';');
    let token = null;
    let hasSubmitted = false;

    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name === 'Authorization') {
        token = value;
      }
      if (name === 'hasSubmittedLetter') {
        hasSubmitted = value === 'true';
      }
    });

    if (token) {
      localStorage.setItem("token", token);
      console.log("✅ 토큰 저장됨:", token);
      
      // 이미 편지를 작성한 경우 다른 페이지로 리다이렉트할 수 있음
      if (hasSubmitted) {
        console.log("✅ 이미 편지를 작성한 사용자입니다.");
        // navigate("/my-letters"); // 필요한 경우 주석 해제
      }
    } else {
      alert("❌ 로그인 토큰이 없습니다. 다시 로그인해주세요.");
      navigate("/");
    }
  }, [navigate]);

  const handleWrite = () => {
    navigate("/write");
  };

  return (
    <div style={styles.container}>
      <img src="/logo.png" alt="logo" style={styles.logo} />
      <button style={styles.writeButton} onClick={handleWrite}>
        ✏️ 편지쓰기
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
  writeButton: {
    backgroundColor: "#ffe4ec",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default AfterLogin;
