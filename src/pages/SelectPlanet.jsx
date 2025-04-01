import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predefinedPositions } from "../utils/predefinedPositions";

const planetImages = Array.from({ length: 16 }, (_, i) => process.env.PUBLIC_URL + `/p${i + 1}.png`);
const getStorageKey = (page) => `solarPlanets_page_${page}`;
const savePlanets = (planets, page) => localStorage.setItem(getStorageKey(page), JSON.stringify(planets));
const loadPlanets = (page) => JSON.parse(localStorage.getItem(getStorageKey(page))) || [];

const SelectPlanet = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("draftLetter"));
    if (saved) setDraft(saved);
  }, []);

  const handleConfirm = () => {
    if (!draft || selected === null) {
      alert("편지 작성과 행성 선택을 완료해주세요!");
      return;
    }
  
    let currentPage = 0;
    let planets = loadPlanets(currentPage);
    const PAGE_LIMIT = 15;
  
    // 페이지 찾기
    while (planets.length >= PAGE_LIMIT) {
      currentPage++;
      planets = loadPlanets(currentPage);
    }

      //  수정 중인 행성이 있다면 삭제
    
      if (draft.id) {
        planets = planets.filter((p) => p.id !== draft.id);
      }
    
      const position = draft.position || predefinedPositions[planets.length];
    

      const newPlanet = {
        id: draft.id || Date.now(),
        src: draft.src || planetImages[selected],
        nickname: draft.nickname,
        message: draft.message,
        paperColor: draft.paperColor,
        position,
      };
    

    // 중복 제거
    planets.push(newPlanet);
  savePlanets(planets, currentPage);

  navigate("/solar-system", {
    state: {
      newPlanet,
      activePage: currentPage,
    }
  });
};

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>행성 선택하기</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        justifyContent: "center",
        maxWidth: "600px",
        margin: "20px auto"
      }}>
        {planetImages.map((src, i) => (
          <img key={i} src={src} alt={`planet${i + 1}`} onClick={() => setSelected(i)}
            style={{
              width: "100px", height: "100px", cursor: "pointer",
              border: selected === i ? "3px solid black" : "1px solid gray",
              borderRadius: "10px", padding: "5px"
            }} />
        ))}
      </div>
      <button onClick={handleConfirm} style={{
        backgroundColor: "#ffee77",
        border: "none",
        padding: "12px 36px",
        borderRadius: "10px",
        fontWeight: "bold",
        fontSize: "18px",
        cursor: "pointer"
      }}>
        행성 선택 완료
      </button>
    </div>
  );
};

export default SelectPlanet;


