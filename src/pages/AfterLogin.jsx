import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AfterLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token); // ✅ 토큰 저장
      console.log("✅ 토큰 저장됨:", token);
    } else {
      alert("❌ 로그인 토큰이 없습니다. 다시 로그인해주세요.");
      navigate("/login");
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
