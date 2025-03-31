import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const planetImages = Array.from({ length: 16 }, (_, i) => process.env.PUBLIC_URL + `/p${i + 1}.png`);

const SelectPlanet = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [letter, setLetter] = useState(null);

  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("draftLetter"));
    if (draft) setLetter(draft);
  }, []);

  const handleConfirm = () => {
    if (selected === null) {
      alert("행성을 선택해주세요!");
      return;
    }
  
    const draft = JSON.parse(localStorage.getItem("draftLetter")); // ✅ 정확히 draftLetter로
    if (!draft) {
      alert("편지를 먼저 작성해주세요!");
      return;
    }
  
    const chosen = planetImages[selected];
  
    const newPlanet = {
      id: Date.now(), // 고유 ID
      src: chosen,
      nickname: draft.nickname,
      message: draft.message,
      paperColor: draft.paperColor,
    };
  
    // ✨ localStorage에 누적 저장
    const saved = JSON.parse(localStorage.getItem("solarPlanets")) || [];
    const updated = [...saved, newPlanet];
    localStorage.setItem("solarPlanets", JSON.stringify(updated));
  
    // ✨ 이때는 location.state 안 넘겨도 됨
    navigate("/solar-system");
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>행성을 선택해주세요!</h2>
      <div style={styles.grid}>
        {planetImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`planet${i + 1}`}
            onClick={() => setSelected(i)}
            style={{
              ...styles.planet,
              transform: selected === i ? "scale(1.15)" : "scale(1)",
              border: selected === i ? "3px solid #444" : "none",
            }}
          />
        ))}
      </div>
      <button onClick={handleConfirm} style={styles.button}>행성 선택하기</button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#FCFCFC",
    minHeight: "100vh",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    justifyContent: "center",
    margin: "20px auto",
    maxWidth: "600px",
  },
  planet: {
    width: "100px",
    height: "100px",
    cursor: "pointer",
    transition: "transform 0.3s ease, border 0.3s ease",
  },
  button: {
    marginTop: "20px",
    padding: "12px 36px",
    backgroundColor: "#ffee77",
    borderRadius: "8px",
    border: "none",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default SelectPlanet;

