import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predefinedPositions } from "../utils/predefinedPositions";
import { choosePlanet } from "../utils/api";

const planetImages = Array.from(
  { length: 16 },
  (_, i) => process.env.PUBLIC_URL + `/p${i + 1}.png`
);

const SelectPlanet = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("draftLetter"));
    if (saved) setDraft(saved);
  }, []);

  const handleConfirm = async () => {
    if (!draft || selected === null) {
      alert("편지 작성과 행성 선택을 완료해주세요!");
      return;
    }
    
    if (!draft.id) {
      alert("편지 정보가 올바르게 저장되지 않았습니다. 편지 작성 페이지로 돌아가 다시 시도해주세요.");
      navigate('/write');
      return;
    }
  
    const position = draft.position || predefinedPositions[0];
    const selectedPlanetUrl = planetImages[selected];
    const planetNumber = selected + 1; // 선택한 행성 번호 (1~16)
  
    try {
      console.log('행성 선택 API 호출, letterId:', draft.id, '행성 번호:', planetNumber);
      // 행성 번호를 전달
      await choosePlanet(draft.id, planetNumber.toString());
      
      const newPlanet = {
        id: draft.id,
        src: selectedPlanetUrl,
        planetNumber: planetNumber, // 행성 번호도 저장
        nickname: draft.nickname,
        message: draft.message,
        paperColor: draft.paperColor,
        position,
      };
      
      localStorage.setItem("selectedPlanet", JSON.stringify(newPlanet));
      navigate("/solar-system", {
        state: {
          newPlanet,
          activePage: 0,
        },
      });
    } catch (error) {
      console.error("행성 선택 실패:", error);
      alert("행성 선택 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>행성 선택하기</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          justifyContent: "center",
          maxWidth: "600px",
          margin: "20px auto",
        }}
      >
        {planetImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`planet${i + 1}`}
            onClick={() => setSelected(i)}
            style={{
              width: "100px",
              height: "100px",
              cursor: "pointer",
              border: selected === i ? "3px solid black" : "1px solid gray",
              borderRadius: "10px",
              padding: "5px",
            }}
          />
        ))}
      </div>
      <button
        onClick={handleConfirm}
        style={{
          backgroundColor: "#ffee77",
          border: "none",
          padding: "12px 36px",
          borderRadius: "10px",
          fontWeight: "bold",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        행성 선택 완료
      </button>
    </div>
  );
};

export default SelectPlanet;


