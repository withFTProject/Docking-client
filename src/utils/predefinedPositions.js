// src/utils/predefinedPositions.js
export const predefinedPositions = (() => {
  const orbits = [140, 185, 230, 275]; // 각 궤도 중심 거리(px)
  const positions = [];

  orbits.forEach((radius) => {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.65; // 타원형 조정
      positions.push({ x: Math.round(x), y: Math.round(y) });
    }
  });

  return positions;
})();
