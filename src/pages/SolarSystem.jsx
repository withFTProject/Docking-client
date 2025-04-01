import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { predefinedPositions } from "../utils/predefinedPositions";

const PAGE_LIMIT = 15;
const getStorageKey = (page) => `solarPlanets_page_${page}`;
const savePlanets = (planets, page) => localStorage.setItem(getStorageKey(page), JSON.stringify(planets));
const loadPlanets = (page) => JSON.parse(localStorage.getItem(getStorageKey(page))) || [];

const SolarSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(location.state?.activePage ?? 0);
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  useEffect(() => {
    let loaded = loadPlanets(currentPage);

    // 편지 수정 후 돌아온 경우: draftLetter에 있는 내용을 반영
    const draft = JSON.parse(localStorage.getItem("draftLetter"));
    if (draft && draft.id) {
      // 기존 행성 업데이트
      loaded = loaded.map(p => (p.id === draft.id ? draft : p));
      savePlanets(loaded, currentPage);
      localStorage.removeItem("draftLetter");
    }

    // 새 행성 추가 시
    if (location.state?.newPlanet) {
      const filtered = loaded.filter(p => p.id !== location.state.newPlanet.id);
      const updated = [...filtered, location.state.newPlanet];
      savePlanets(updated, currentPage);
      setPlanets(updated);
      setTimeout(() => navigate(".", { replace: true }), 0);
    } else {
      setPlanets(loaded);
    }
  }, [location, currentPage, navigate]);

  const handleDelete = (id) => {
    const updated = planets.filter(p => p.id !== id);
    savePlanets(updated, currentPage);
    setPlanets(updated);
    setSelectedPlanet(null);
  };

  const handleEdit = () => {
    const { id, nickname, message, paperColor, src, position } = selectedPlanet;
    localStorage.setItem("draftLetter", JSON.stringify({
      id, nickname, message, paperColor, src, position,
    }));
    navigate("/write-letter");
  };
  

  return (
    <div style={styles.wrapper}>
      {planets.map((planet, idx) => (
        <div key={planet.id}>
          <img
            src={planet.src}
            alt="planet"
            onClick={() => setSelectedPlanet(planet)}
            style={{
              ...styles.planet,
              left: `calc(50% + ${predefinedPositions[idx].x}px)`,
              top: `calc(50% + ${predefinedPositions[idx].y}px)`,
            }}
          />
          <div style={{
            ...styles.nameTag,
            left: `calc(50% + ${predefinedPositions[idx].x}px)`,
            top: `calc(50% + ${predefinedPositions[idx].y + 35}px)`
          }}>
            {planet.nickname}
          </div>
        </div>
      ))}

      {/* 편지 모달 */}
      {selectedPlanet && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.letterBox, backgroundColor: selectedPlanet.paperColor }}>
            <div style={styles.modalHeader}>To. {selectedPlanet.nickname}</div>
            <div style={styles.modalMessage}>{selectedPlanet.message}</div>
            <div style={styles.modalButtons}>
              <button style={styles.button} onClick={handleEdit}>수정</button>
              <button style={styles.button} onClick={() => handleDelete(selectedPlanet.id)}>삭제</button>
              <button style={styles.button} onClick={() => setSelectedPlanet(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* 페이지 전환 */}
      <div style={styles.pageControl}>
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={styles.button}
        >
          이전 페이지
        </button>
        <button
          disabled={planets.length < PAGE_LIMIT}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={styles.button}
        >
          다음 페이지
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${process.env.PUBLIC_URL}/space.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
  },
  planet: {
    position: "absolute",
    width: 70,
    height: 70,
    transform: "translate(-50%, -50%)",
    cursor: "pointer",
    zIndex: 2,
  },
  nameTag: {
    position: "absolute",
    fontSize: "14px",
    color: "#fff",
    fontWeight: "bold",
    transform: "translate(-50%, 0)",
    zIndex: 3,
    fontFamily: "'Dongle', sans-serif",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw", height: "100vh",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10
  },
  letterBox: {
    width: "550px",
    padding: "40px",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 0 15px rgba(0,0,0,0.5)",
    fontFamily: "'Dongle', sans-serif",
    fontSize: "20px",
  },
  modalHeader: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px"
  },
  modalMessage: {
    whiteSpace: "pre-wrap",
    marginBottom: "20px"
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end"
  },
  button: {
    backgroundColor: "#ffee77",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer"
  },
  pageControl: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    display: "flex",
    gap: "12px",
  }
};

export default SolarSystem;


