import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WriteLetter = () => {
  // 상태 선언
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [paperColor, setPaperColor] = useState("#ffffff");
  const navigate = useNavigate();

  // ✅ useEffect는 함수 안에, return 밖에 위치해야 함
  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("draftLetter"));
    if (draft) {
      setNickname(draft.nickname);
      setMessage(draft.message);
      setPaperColor(draft.paperColor);
    }
  }, []);



  const paperColors = [
    "#fff0f0", "#ebffe6", "#e6f7ff", "#f1e6ff", "#ffe6fa", "#fffbe6", "#f9ffe6", "#D4D4D4"
  ];

  const handleSave = () => {
    if (!nickname || !message) {
      alert("이름과 편지를 모두 작성해주세요!");
      return;
    }
  
    // ✨ localStorage에 저장
    localStorage.setItem("draftLetter", JSON.stringify({
      nickname,
      message,
      paperColor
    }));
  
    navigate("/select-planet");
  };
  

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="이름을 적어주세요"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="편지를 작성해주세요"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ ...styles.textarea, backgroundColor: paperColor }}
      />

      <div style={styles.colorScroll}>
        {paperColors.map((color) => (
          <div
            key={color}
            style={{
              ...styles.colorBox,
              backgroundColor: color,
              border: paperColor === color ? "2px solid black" : "1px solid #ccc",
            }}
            onClick={() => setPaperColor(color)}
          />
        ))}
      </div>

      <button onClick={handleSave} style={styles.saveBtn}>저장</button>
    </div>
  );
};

const styles = {

  page: {
    fontFamily: "'Noto Sans KR', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
  },

  container: {
    height: "100vh",
    padding: "40px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // ✅ 좌측 정렬로 변경
  },
  
  input: {
    padding: "12px 24px",
    fontSize: "18px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    backgroundColor: "#ffee77",
    fontWeight: "bold",
    marginBottom: "20px",
    marginLeft: "275px", // ✅ 이미지처럼 좀 안쪽으로
    marginTop: "100px", // ← 원하는 만큼 조정
    marginBottom: "50px",    // ✅ 아래 여백도 늘림
  },
  
  textarea: {
    width: "60%",
    height: "250px",
    padding: "20px",
    fontSize: "22px", // ✨ Dongle은 약간 크게!
    borderRadius: "12px",
    border: "1px solid #333",
    resize: "none",
    fontWeight: "normal",
    marginBottom: "10px",
    marginLeft: "280px",
    lineHeight: "1.6",
    fontFamily: "'Dongle', sans-serif", // ✅ 글씨체 적용
    color: "#333",
    marginTop: "10px", // ← 원하는 만큼 조정

  },
  
  
  
  saveBtnWrapper: {
    width: "80%",
    display: "flex",
    justifyContent: "flex-end", // ✅ 오른쪽 정렬
    marginLeft: "280px", // ✅ 글칸에 맞추기
  },
  scrollBox: {
    width: "100%",
    overflowX: "auto",
    marginBottom: "24px",
  },

  colorScroll: {
    display: "flex",
    overflowX: "auto",       // 스크롤 생성
    maxWidth: "250px",       // ✅ 4개 정도만 보이게 제한
    paddingBottom: "8px",
    marginLeft: "280px",
  },
  colorBox: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    marginRight: "8px",
    cursor: "pointer",
    flexShrink: 0,   // ✅ 축소 금지 → 스크롤 가능
  },
  

  saveBtn: {
    backgroundColor: "#ffee77",
    border: "none",
    padding: "12px 50px",
    fontWeight: "bold",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    marginLeft: "1050px",
  },
};

export default WriteLetter;