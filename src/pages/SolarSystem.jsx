import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { predefinedPositions } from "../utils/predefinedPositions";

const PAGE_LIMIT = 15;

const SolarSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(location.state?.activePage ?? 0);
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchPlanets = async () => {
      try {
        const res = await fetch(`http://localhost:8080/planet/main?page=${currentPage}&size=${PAGE_LIMIT}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const content = data.result?.content || [];

        // 좌표 부여
        const planetsWithPos = content.map((p, i) => ({
          id: p.letterId,
          src: p.planet,
          nickname: p.nickname || "익명",
          message: p.description || "내용 없음",
          paperColor: p.paperColor || "#fff0f0",
          position: predefinedPositions[i],
        }));
        setPlanets(planetsWithPos);
      } catch (error) {
        console.error("행성 로드 실패", error);
      }
    };

    fetchPlanets();
  }, [currentPage]);

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/letter/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          console.log("✅ 편지 삭제 완료");
          setPlanets((prev) => prev.filter((p) => p.id !== id));
          setSelectedPlanet(null);
        } else {
          console.error("❌ 삭제 실패");
        }
      })
      .catch((err) => console.error("에러:", err));
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
              left: `calc(50% + ${planet.position.x}px)`,
              top: `calc(50% + ${planet.position.y}px)`,
            }}
          />
          <div style={{
            ...styles.nameTag,
            left: `calc(50% + ${planet.position.x}px)`,
            top: `calc(50% + ${planet.position.y + 35}px)`
          }}>
            {planet.nickname}
          </div>
        </div>
      ))}

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

      <div style={styles.pageControl}>
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={styles.button}
        >
          이전 페이지
        </button>
        <button
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



