import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { predefinedPositions } from "../utils/predefinedPositions";
import { getPlanets, deleteLetter, getLetter } from "../utils/api"; 

const PAGE_LIMIT = 15;

const planetImages = Array.from(
  { length: 16 },
  (_, i) => process.env.PUBLIC_URL + `/p${i + 1}.png`
);

const SolarSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPlanets(currentPage);
  }, [currentPage]);

  // useEffect(() => {
  //   const newPlanet = location.state?.newPlanet;
  //   if (newPlanet) {
  //     setPlanets((prev) => [...prev, newPlanet]);
  //     setTimeout(() => navigate(".", { replace: true }), 0);
  //   }
  // }, [location, navigate]);
  useEffect(() => {
    // 새 행성이 있어도 기존 목록에 추가하지 않음
    const newPlanet = location.state?.newPlanet;
    if (newPlanet) {
      setTimeout(() => {
        navigate(".", { replace: true });
        fetchPlanets(currentPage);
      }, 0);
    }
  }, [location, navigate]);

  const fetchPlanets = async (page) => {
    try {
      // 행성 목록 조회
      const res = await getPlanets(page, PAGE_LIMIT);
      console.log("행성 목록 응답:", res);
      
      if (res.isSuccess && res.result && res.result.content) {
        // 여기에 totalPages 설정 추가
        setTotalPages(res.result.totalPages || 1);
        
        const planetList = res.result.content;
        
        // 각 행성별로 상세 정보 가져오기
        const planetsWithDetails = await Promise.all(
          planetList.map(async (p, i) => {
            try {
              // 백엔드에서 받은 planet 필드가 행성 번호인 경우
              const planetNumber = parseInt(p.planet) || 1;
              // 행성 번호로 이미지 경로 생성 (1~16 사이로 제한)
              const planetIndex = Math.min(Math.max(planetNumber, 1), 16) - 1;
              const planetImage = planetImages[planetIndex];
              
              // 개별 편지 정보는 필요할 때만 가져오기
              return {
                id: p.id,
                src: planetImage, // 선택된 행성 이미지 사용
                nickname: p.title,
                position: predefinedPositions[i % predefinedPositions.length],
              };
            } catch (err) {
              console.error(`행성 ${p.id} 처리 실패:`, err);
              return {
                id: p.id,
                src: planetImages[0], // 기본 행성 이미지
                nickname: p.title || "행성",
                position: predefinedPositions[i % predefinedPositions.length],
              };
            }
          })
        );
        
        // 기존 행성이 아닌 새로운 행성 목록으로 설정
        setPlanets(planetsWithDetails);
      } else {
        console.error("🚨 행성 목록 응답 형식 오류:", res);
      }
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

  const fetchPlanetDetails = async (planet) => {
    try {
      const letterDetail = await getLetter(planet.id);
      console.log(`편지 ${planet.id} 상세정보:`, letterDetail);
      
      setSelectedPlanet({
        ...planet,
        message: letterDetail.description || "편지 내용을 불러올 수 없습니다.",
        paperColor: letterDetail.color || "#fff"
      });
    } catch (error) {
      console.error(`편지 ${planet.id} 상세정보 가져오기 실패:`, error);
      setSelectedPlanet({
        ...planet,
        message: "편지 내용을 불러올 수 없습니다.",
        paperColor: "#fff"
      });
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
            onClick={() => fetchPlanetDetails(planet)}
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
              {/* <button style={styles.button} onClick={handleEdit}>수정</button> */}
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
        <span style={{
          color: "white",
          margin: "0 10px",
          fontSize: "16px",
          fontWeight: "bold"
        }}>
          페이지 {currentPage + 1}
        </span>
        <button
          disabled={currentPage >= totalPages - 1}
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



