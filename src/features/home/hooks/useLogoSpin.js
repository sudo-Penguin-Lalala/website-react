import { useState, useRef, useEffect } from "react";

export function getSpinAchievement(count, isVi) {
  if (count >= 50) {
    return {
      badge: "MAX",
      icon: "🏆",
      title: isVi ? "Động cơ Vĩnh cửu!" : "Perpetual Motion Machine!",
    };
  }
  if (count >= 25) {
    return {
      badge: "Lv.4",
      icon: "🚀",
      title: isVi ? "Rotor ép xung!" : "Overclocked Rotor!",
    };
  }
  if (count >= 10) {
    return {
      badge: "Lv.3",
      icon: "💫",
      title: isVi ? "Bậc thầy ly tâm!" : "Centrifugal Master!",
    };
  }
  if (count >= 5) {
    return {
      badge: "Lv.2",
      icon: "⚡",
      title: isVi ? "Máy phát điện động năng!" : "Kinetic Generator!",
    };
  }
  return {
    badge: "Lv.1",
    icon: "🌀",
    title: isVi ? "Khởi động rotor!" : "Rotor Online!",
  };
}

export function useLogoSpin() {
  const [spinDeg, setSpinDeg] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinBadgeVisible, setIsSpinBadgeVisible] = useState(false);
  const [isSpinBadgeLeaving, setIsSpinBadgeLeaving] = useState(false);

  const spinIdleTimerRef = useRef(null);
  const spinResetTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (spinIdleTimerRef.current) clearTimeout(spinIdleTimerRef.current);
      if (spinResetTimerRef.current) clearTimeout(spinResetTimerRef.current);
    };
  }, []);

  const handleSpinLogo = () => {
    const nextDeg = spinDeg + 720;
    const nextCount = spinCount + 1;
    setSpinDeg(nextDeg);
    setSpinCount(nextCount);
    setIsSpinBadgeVisible(true);
    setIsSpinBadgeLeaving(false);

    if (spinIdleTimerRef.current) clearTimeout(spinIdleTimerRef.current);
    if (spinResetTimerRef.current) clearTimeout(spinResetTimerRef.current);

    spinIdleTimerRef.current = setTimeout(() => {
      setIsSpinBadgeLeaving(true);
      spinResetTimerRef.current = setTimeout(() => {
        setIsSpinBadgeVisible(false);
        setIsSpinBadgeLeaving(false);
        setSpinCount(0);
      }, 450);
    }, 5000);
  };

  return {
    spinDeg,
    spinCount,
    isSpinBadgeVisible,
    isSpinBadgeLeaving,
    handleSpinLogo,
    getSpinAchievement,
  };
}
