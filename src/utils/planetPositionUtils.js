// ✅ 이게 정확한 구조야!
export function generateOrbitPosition(radius, usedAngles, minGap = 30) {
    let angle;
    let isOverlap = true;
  
    while (isOverlap) {
      angle = Math.floor(Math.random() * 360);
      isOverlap = usedAngles.some((a) => Math.abs(a - angle) < minGap);
    }
  
    usedAngles.push(angle);
  
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
  
    return { x, y };
  }
  
  