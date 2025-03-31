import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { predefinedPositions } from "../utils/predefinedPositions";

const MIN_DISTANCE = 100;
const PAGE_LIMIT = 16;

const getStorageKey = (page) => `solarPlanets_page_${page}`;
const savePlanets = (planets, page) => {
  localStorage.setItem(getStorageKey(page), JSON.stringify(planets));
};
const loadPlanets = (page) => {
  return JSON.parse(localStorage.getItem(getStorageKey(page))) || [];
};

// 거리 계산
const getDistance = (pos1, pos2) => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// 중복 방지 안전 위치
const getSafeRandomPosition = (usedPositions) => {
  const shuffled = [...predefinedPositions].sort(() => Math.random() - 0.5);
  for (let candidate of shuffled) {
    const tooClose = usedPositions.some(pos => getDistance(pos, candidate) < MIN_DISTANCE);
    if (!tooClose) {
      usedPositions.push(candidate);
      return candidate;
    }
  }
  console.warn(" 좌표 부족 → 첫 번째 좌표 사용");
  return predefinedPositions[0];
};

const SolarSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const usedPositionsRef = useRef([]);

  // 페이지 진입 시
  useEffect(() => {
    const loaded = loadPlanets(currentPage);
    usedPositionsRef.current = [];

    const withPosition = loaded.map(p => ({
      ...p,
      position: p.position || getSafeRandomPosition(usedPositionsRef.current),
    }));
    setPlanets(withPosition);
  }, [currentPage]);

  // 새 편지 추가
  useEffect(() => {
    if (location.state?.newPlanet) {
      let page = currentPage;
      let currentList = loadPlanets(page);

      if (currentList.length >= PAGE_LIMIT) {
        page += 1;
        setCurrentPage(page);
        currentList = loadPlanets(page);
      }

      const newPlanet = {
        ...location.state.newPlanet,
        id: Date.now(),
        position: getSafeRandomPosition(usedPositionsRef.current),
      };

      const updated = [...currentList, newPlanet];
      savePlanets(updated, page);
      setPlanets(updated);
      navigate(".", { replace: true });
    }
  }, [location]);

  const handlePlanetClick = (planet) => setSelectedPlanet(planet);
  const handleClose = () => setSelectedPlanet(null);
  const handleDelete = (id) => {
    const updated = planets.filter(p => p.id !== id);
    savePlanets(updated, currentPage);
    setPlanets(updated);
    handleClose();
  };
  const handleEdit = () => {
    const { nickname, message, paperColor } = selectedPlanet;
    localStorage.setItem("draftLetter", JSON.stringify({ nickname, message, paperColor }));
    navigate("/write-letter");
  };

  return (
    <div style={styles.wrapper}>
      {/* 행성 및 이름 */}
      {planets.map((planet) => (
        <div key={planet.id}>
          <img
            src={planet.src}
            onClick={() => handlePlanetClick(planet)}
            style={{
              ...styles.planet,
              left: `calc(50% + ${planet.position.x}px)`,
              top: `calc(50% + ${planet.position.y}px)`,
            }}
            alt="planet"
          />
          <div
            style={{
              ...styles.nameTag,
              left: `calc(50% + ${planet.position.x}px)`,
              top: `calc(50% + ${planet.position.y + 35}px)`,
            }}
          >
            {planet.nickname}
          </div>
        </div>
      ))}

      {/* 편지 모달 */}
      {selectedPlanet && (
        <div style={styles.fullModal}>
          <div style={styles.bgImage}>
            <div style={styles.toBox}>To. {selectedPlanet.nickname}</div>
            <div
              style={{
                ...styles.messageBox,
                backgroundColor: selectedPlanet.paperColor,
              }}
            >
              {selectedPlanet.message}
            </div>
            <div style={styles.buttonBox}>
              <button style={styles.yellowButton} onClick={handleEdit}>수정</button>
              <button style={styles.yellowButton} onClick={() => handleDelete(selectedPlanet.id)}>삭제</button>
              <button style={styles.yellowButton} onClick={handleClose}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* 페이지 전환 */}
      <div style={styles.pageButtons}>
        {currentPage > 0 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>이전 페이지</button>
        )}
        {planets.length >= PAGE_LIMIT && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>다음 페이지</button>
        )}
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
    width: "60px",
    height: "60px",
    transform: "translate(-50%, -50%)",
    cursor: "pointer",
    zIndex: 2,
  },
  nameTag: {
    position: "absolute",
    fontSize: "14px",
    color: "#fff",
    transform: "translate(-50%, 0)",
    zIndex: 3,
    fontFamily: "'Dongle', sans-serif",
  },
  fullModal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  bgImage: {
    width: "700px",
    height: "550px",
    backgroundImage: `url(${process.env.PUBLIC_URL}/letter-bg.png)`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    borderRadius: "20px",
  },
  toBox: {
    backgroundColor: "#ffee77",
    padding: "6px 18px",
    fontWeight: "bold",
    fontSize: "20px",
    borderRadius: "10px",
    alignSelf: "flex-start",
    marginBottom: "10px",
    fontFamily: "'Dongle', sans-serif",
  },
  messageBox: {
    width: "90%",
    height: "230px",
    borderRadius: "12px",
    padding: "20px",
    fontSize: "22px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    fontFamily: "'Dongle', sans-serif",
  },
  buttonBox: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "16px",
    alignSelf: "flex-end",
  },
  yellowButton: {
    backgroundColor: "#ffee77",
    border: "none",
    padding: "8px 16px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },
  pageButtons: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "12px",
  },
};


export default SolarSystem;
