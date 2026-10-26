import { useState, useRef, useEffect } from "preact/hooks";

const LIFETIME_KEY = "nnt:power_lifetime";
const RECORD_KEY = "nnt:power_record";

export function getSpinAchievement(count, isVi) {
  if (count >= 1000) {
    return {
      badge: "PERPETUAL",
      icon: "☢️",
      wh: "~1.5 kWh",
      title: isVi ? "Động cơ vĩnh cửu" : "Perpetual motion",
    };
  }
  if (count >= 500) {
    return {
      badge: "OVERLOAD",
      icon: "🔥",
      wh: "~750 Wh",
      title: isVi ? "Vòng bi bốc khói" : "Overheated bearings",
    };
  }
  if (count >= 300) {
    return {
      badge: "MAX",
      icon: "🔋",
      wh: "~450 Wh",
      title: isVi ? "Sạc xe máy điện chạy 500m" : "Enough to charge e-scooter",
    };
  }
  if (count >= 200) {
    return {
      badge: "Lv.6",
      icon: "🗄️",
      wh: "~300 Wh",
      title: isVi ? "Tải Mini PC 100% CPU" : "Powering Mini-PC at 100% CPU",
    };
  }
  if (count >= 100) {
    return {
      badge: "Lv.5",
      icon: "📡",
      wh: "~150 Wh",
      title: isVi ? "Cứu mạng Wi-Fi 15 phút" : "Keeping Wi-Fi alive for 15m",
    };
  }
  if (count >= 50) {
    return {
      badge: "Lv.4",
      icon: "🖥️",
      wh: "~75 Wh",
      title: isVi ? "Boot Raspberry Pi 4" : "Booting Raspberry Pi 4",
    };
  }
  if (count >= 20) {
    return {
      badge: "Lv.3",
      icon: "💡",
      wh: "~30 Wh",
      title: isVi ? "Thắp bóng đèn 5W" : "Lighting 5W bulb",
    };
  }
  if (count >= 5) {
    return {
      badge: "Lv.2",
      icon: "⚡",
      wh: "~7.5 Wh",
      title: isVi ? "Nuôi pin CMOS" : "Keeping CMOS alive",
    };
  }
  return {
    badge: "Lv.1",
    icon: "🌀",
    wh: "~1.5 Wh",
    title: isVi ? "Nuôi đèn chuột quang" : "Powering mouse LED",
  };
}

export function useLogoSpin() {
  const [spinDeg, setSpinDeg] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [lifetimeSpins, setLifetimeSpins] = useState(() => {
    try {
      return parseInt(localStorage.getItem(LIFETIME_KEY) || "0", 10) || 0;
    } catch {
      return 0;
    }
  });
  const [bestRecord, setBestRecord] = useState(() => {
    try {
      return parseInt(localStorage.getItem(RECORD_KEY) || "0", 10) || 0;
    } catch {
      return 0;
    }
  });

  const [isSpinBadgeVisible, setIsSpinBadgeVisible] = useState(false);
  const [isSpinBadgeLeaving, setIsSpinBadgeLeaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const spinIdleTimerRef = useRef(null);
  const spinResetTimerRef = useRef(null);
  const copyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (spinIdleTimerRef.current) clearTimeout(spinIdleTimerRef.current);
      if (spinResetTimerRef.current) clearTimeout(spinResetTimerRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleSpinLogo = () => {
    const nextDeg = spinDeg + 720;
    const nextCount = spinCount + 1;
    setSpinDeg(nextDeg);
    setSpinCount(nextCount);
    setIsSpinBadgeVisible(true);
    setIsSpinBadgeLeaving(false);

    // Save persistent lifetime & record
    setLifetimeSpins((prev) => {
      const nextLife = prev + 1;
      try {
        localStorage.setItem(LIFETIME_KEY, String(nextLife));
      } catch {
        // Ignore
      }
      return nextLife;
    });

    setBestRecord((prev) => {
      if (nextCount > prev) {
        try {
          localStorage.setItem(RECORD_KEY, String(nextCount));
        } catch {
          // Ignore
        }
        return nextCount;
      }
      return prev;
    });

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

  const copyReceipt = (isVi) => {
    const ach = getSpinAchievement(spinCount, isVi);
    const text = isVi
      ? `Quay logo ${spinCount} vòng (${ach.wh}) trên nnt25.io.vn: [${ach.badge}] ${ach.title}.`
      : `Spun logo ${spinCount} times (${ach.wh}) on nnt25.io.vn: [${ach.badge}] ${ach.title}.`;

    try {
      navigator.clipboard?.writeText(text);
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return {
    spinDeg,
    spinCount,
    lifetimeSpins,
    bestRecord,
    isSpinBadgeVisible,
    isSpinBadgeLeaving,
    copied,
    handleSpinLogo,
    copyReceipt,
    getSpinAchievement,
  };
}
