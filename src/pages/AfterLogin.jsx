import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const AfterLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({
    tokenFromURL: null,
    tokenFromCookie: null,
    tokenFromStorage: null
  });

  // useEffect(() => {
  //   // 쿠키에서 토큰 읽기
  //   const cookies = document.cookie.split(';');
  //   let token = null;
  //   let hasSubmitted = false;

  //   cookies.forEach(cookie => {
  //     const [name, value] = cookie.trim().split('=');
  //     if (name === 'Authorization') {
  //       token = value;
  //     }
  //     if (name === 'hasSubmittedLetter') {
  //       hasSubmitted = value === 'true';
  //     }
  //   });

  //   if (token) {
  //     localStorage.setItem("token", token);
  //     console.log("✅ 토큰 저장됨:", token);
      
  //     // 이미 편지를 작성한 경우 다른 페이지로 리다이렉트할 수 있음
  //     if (hasSubmitted) {
  //       console.log("✅ 이미 편지를 작성한 사용자입니다.");
  //       // navigate("/my-letters"); // 필요한 경우 주석 해제
  //     }
  //   } else {
  //     alert("❌ 로그인 토큰이 없습니다. 다시 로그인해주세요.");
  //     navigate("/");
  //   }
  // }, [navigate]);
  // useEffect(() => {
  //   // URL 쿼리 파라미터에서 토큰 가져오기 시도
  //   const queryParams = new URLSearchParams(location.search);
  //   const tokenFromQuery = queryParams.get('token');
    
  //   // 쿠키에서 토큰 읽기
  //   const cookies = document.cookie.split(';');
  //   let tokenFromCookie = null;
  //   let hasSubmitted = false;
    
  //   cookies.forEach(cookie => {
  //     const [name, value] = cookie.trim().split('=');
  //     if (name === 'Authorization') {
  //       tokenFromCookie = value;
  //     }
  //     if (name === 'hasSubmittedLetter') {
  //       hasSubmitted = value === 'true';
  //     }
  //   });
    
  //   // 쿼리 파라미터 또는 쿠키에서 토큰 사용
  //   const token = tokenFromQuery || tokenFromCookie;
    
  //   if (token) {
  //     localStorage.setItem("token", token);
  //     console.log("✅ 토큰 저장됨:", token);
      
  //     if (hasSubmitted) {
  //       console.log("✅ 이미 편지를 작성한 사용자입니다.");
  //       // navigate("/my-letters"); // 필요한 경우 주석 해제
  //     }
      
  //     // 쿼리 파라미터가 있다면 깨끗한 URL로 리다이렉트
  //     if (tokenFromQuery) {
  //       navigate(location.pathname, { replace: true });
  //     }
  //   } else {
  //     alert("❌ 로그인 토큰이 없습니다. 다시 로그인해주세요.");
  //     navigate("/");
  //   }
    
  //   setIsLoading(false);
  // }, [navigate, location]);

  useEffect(() => {
    console.log("AfterLogin 컴포넌트 마운트됨");
    
    // URL 쿼리 파라미터에서 정보 가져오기
    const queryParams = new URLSearchParams(location.search);
    const tokenFromQuery = queryParams.get('token');
    const hasSubmittedFromQuery = queryParams.get('hasSubmitted');
    
    console.log("URL 파라미터 토큰:", tokenFromQuery);
    
    // 로컬 스토리지에서 기존 토큰 확인
    const tokenFromStorage = localStorage.getItem("token");
    
    // 우선순위: URL 쿼리 > 기존 스토리지
    const token = tokenFromQuery || tokenFromStorage;
    const hasSubmitted = hasSubmittedFromQuery === 'true' || 
                          localStorage.getItem("hasSubmittedLetter") === 'true';
    
    if (token) {
      // 새 토큰이 URL에서 온 경우 저장
      if (tokenFromQuery) {
        localStorage.setItem("token", token);
        console.log("✅ 새 토큰 저장됨:", token);
        
        // hasSubmitted 상태 저장
        localStorage.setItem("hasSubmittedLetter", String(hasSubmitted));
        
        // 쿼리 파라미터 제거를 위한 클린 URL로 리다이렉트 (상태 유지)
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState(null, '', cleanUrl);
      } else {
        console.log("✅ 기존 토큰 사용:", token);
      }
      
      if (hasSubmitted) {
        console.log("✅ 이미 편지를 작성한 사용자입니다.");
        // navigate("/my-letters"); // 필요한 경우 주석 해제
      } else {
        console.log("📝 편지를 작성할 수 있는 사용자입니다.");
      }
    } else {
      console.error("❌ 토큰을 찾을 수 없습니다.");
      alert("❌ 로그인 토큰이 없습니다. 다시 로그인해주세요.");
      navigate("/");
    }
    
    setIsLoading(false);
  }, [navigate, location]);

  const handleWrite = () => {
    navigate("/write");
  };

  // 디버깅 정보를 화면에 표시 (문제 해결 후 제거)
  const renderDebugInfo = () => (
    <div style={{ backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '20px', fontSize: '12px' }}>
      <h4>디버깅 정보</h4>
      <div>URL 토큰: {debugInfo.tokenFromURL || '없음'}</div>
      <div>쿠키 토큰: {debugInfo.tokenFromCookie || '없음'}</div>
      <div>스토리지 토큰: {debugInfo.tokenFromStorage || '없음'}</div>
      <div>현재 URL: {window.location.href}</div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* {renderDebugInfo()} 문제 해결 후 제거 */}
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
