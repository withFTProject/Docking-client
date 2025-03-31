import React from "react";
import { useNavigate } from "react-router-dom";

const AfterLogin = () => {
  const navigate = useNavigate();

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
    backgroundColor: "#ffe4ec", // 연한 핑크
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default AfterLogin;