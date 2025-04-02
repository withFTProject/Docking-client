import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { predefinedPositions } from "../utils/predefinedPositions";
import { getPlanets, deleteLetter } from "../utils/api";

const PAGE_LIMIT = 15;

const SolarSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  useEffect(() => {
    fetchPlanets(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const newPlanet = location.state?.newPlanet;
    if (newPlanet) {
      setPlanets((prev) => [...prev, newPlanet]);
      setTimeout(() => navigate(".", { replace: true }), 0);
    }
  }, [location, navigate]);

  const fetchPlanets = async (page) => {
    try {
      const res = await getPlanets(page, PAGE_LIMIT);
      const planetList = res.result.content;

      // 위치 좌표 부여
      const withPosition = planetList.map((p, i) => ({
        id: p.id,
        src: p.planet,
        nickname: p.title,
        message: p.description,
        paperColor: p.color || "#fff", // 백엔드에서 색상 포함 시 반영
        position: predefinedPositions[i],
      }));
      setPlanets(withPosition);
    } catch (err) {
      console.error("🚨 행성 목록 불러오기 실패:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLetter(id);
      setPlanets((prev) => prev.filter((p) => p.id !== id));
      setSelectedPlanet(null);
    } catch (error) {
      console.error("❌ 삭제 실패:", error.message);
    }
  };

  const handleEdit = () => {
    if (!selectedPlanet) return;
    const { id, nickname, message, paperColor, src, position } = selectedPlanet;
    localStorage.setItem("draftLetter", JSON.stringify({
      id,
      nickname,
      message,
      paperColor,
      src,
      position,
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
              left: `calc(50% + ${planet.position.x}px)`,
              top: `calc(50% + ${planet.position.y}px)`
            }}
          />
          <div
            style={{
              ...styles.nameTag,
              left: `calc(50% + ${planet.position.x}px)`,
              top: `calc(50% + ${planet.position.y + 35}px)`
            }}
          >
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
          onClick={() => setCurrentPage((prev) => prev - 1)}
          style={styles.button}
        >
          이전 페이지
        </button>
        <button
          disabled={planets.length < PAGE_LIMIT}
          onClick={() => setCurrentPage((prev) => prev + 1)}
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
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
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
    marginBottom: "20px",
  },
  modalMessage: {
    whiteSpace: "pre-wrap",
    marginBottom: "20px",
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "#ffee77",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },
  pageControl: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    display: "flex",
    gap: "12px",
  },
};

export default SolarSystem;



