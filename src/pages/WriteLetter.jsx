import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLetter, updateLetter } from "../utils/api";

const WriteLetter = () => {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [paperColor, setPaperColor] = useState("#ffffff");
  const [isEdit, setIsEdit] = useState(false);
  const [letterId, setLetterId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("draftLetter"));
    if (draft) {
      setNickname(draft.nickname);
      setMessage(draft.message);
      setPaperColor(draft.paperColor);
      setLetterId(draft.id);
      setIsEdit(true);
    }
  }, []);

  const paperColors = ["#fff0f0", "#ebffe6", "#e6f7ff", "#f1e6ff", "#ffe6fa", "#fffbe6", "#f9ffe6", "#D4D4D4"];

  const handleSave = async () => {
    if (!nickname || !message) {
      alert("이름과 편지를 모두 작성해주세요!");
      return;
    }

    const letterData = {
      title: nickname,
      description: message,
      sticker: "none",
    };

    try {
      let response;
      if (isEdit && letterId) {
        await updateLetter(letterId, letterData);
        response = { id: letterId };
        console.log("✅ 편지 수정 완료");
      } else {
        response = await createLetter(letterData);
        console.log("✅ 편지 등록 완료");
      }

      localStorage.setItem("draftLetter", JSON.stringify({
        id: response.id,
        nickname,
        message,
        paperColor,
      }));

      localStorage.setItem("letterId", response.id); // 행성 선택 시 사용
      navigate("/select-planet");
    } catch (error) {
      console.error("❌ 저장 실패:", error.message);
    }
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
  container: {
    height: "100vh",
    padding: "40px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  input: {
    padding: "12px 24px",
    fontSize: "18px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    backgroundColor: "#ffee77",
    fontWeight: "bold",
    marginBottom: "20px",
    marginLeft: "275px",
    marginTop: "70px",
  },
  textarea: {
    width: "60%",
    height: "250px",
    padding: "20px",
    fontSize: "22px",
    borderRadius: "12px",
    border: "1px solid #333",
    resize: "none",
    fontWeight: "normal",
    marginBottom: "10px",
    marginLeft: "280px",
    lineHeight: "1.6",
    fontFamily: "'Dongle', sans-serif",
    color: "#333",
  },
  colorScroll: {
    display: "flex",
    overflowX: "auto",
    maxWidth: "250px",
    paddingBottom: "8px",
    marginLeft: "280px",
  },
  colorBox: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    marginRight: "8px",
    cursor: "pointer",
    flexShrink: 0,
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

