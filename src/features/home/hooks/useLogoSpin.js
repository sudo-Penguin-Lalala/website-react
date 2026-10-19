import { useState, useRef, useEffect } from "react";

const LIFETIME_KEY = "nnt:power_lifetime";
const RECORD_KEY = "nnt:power_record";

export function getSpinAchievement(count, isVi) {
  if (count >= 1000) {
    return {
      badge: "PERPETUAL",
      icon: "☢️",
      wh: "~1.5 kWh",
      title: isVi
        ? "Động cơ vĩnh cửu! (Cứu vãn khủng hoảng năng lượng toàn cầu)"
        : "Perpetual Motion! (Solved global energy crisis)",
    };
  }
  if (count >= 500) {
    return {
      badge: "OVERLOAD",
      icon: "🔥",
      wh: "~750 Wh",
      title: isVi
        ? "Rotor bốc khói! (Nhiệt độ vòng bi vượt ngưỡng)"
        : "Rotor Overheating! (Bearings exceed safety limits)",
    };
  }
  if (count >= 300) {
    return {
      badge: "MAX",
      icon: "🔋",
      wh: "~450 Wh",
      title: isVi
        ? "[Tổ máy số 1]: Đủ sạc xe máy điện chạy 500m!"
        : "[Turbine Unit 1]: Enough charge for an e-scooter run!",
    };
  }
  if (count >= 200) {
    return {
      badge: "Lv.6",
      icon: "🗄️",
      wh: "~300 Wh",
      title: isVi
        ? "Mini PC Homelab! (Tải kịch kim 100% CPU)"
        : "Homelab Mini-PC! (Full 100% CPU load)",
    };
  }
  if (count >= 100) {
    return {
      badge: "Lv.5",
      icon: "📡",
      wh: "~150 Wh",
      title: isVi
        ? "Cục phát Wi-Fi! (Cứu mạng 15 phút cúp điện)"
        : "Wi-Fi Router! (15 mins uptime during blackout)",
    };
  }
  if (count >= 50) {
    return {
      badge: "Lv.4",
      icon: "🖥️",
      wh: "~75 Wh",
      title: isVi
        ? "Raspberry Pi 4! (Đủ điện boot vào Linux)"
        : "Raspberry Pi 4! (Enough juice to boot Linux)",
    };
  }
  if (count >= 20) {
    return {
      badge: "Lv.3",
      icon: "💡",
      wh: "~30 Wh",
      title: isVi
        ? "Bóng đèn 5W! (Thắp sáng góc bàn làm việc)"
        : "5W Filament Bulb! (Desk workspace illuminated)",
    };
  }
  if (count >= 5) {
    return {
      badge: "Lv.2",
      icon: "⚡",
      wh: "~7.5 Wh",
      title: isVi
        ? "Pin CMOS! (Giữ giờ cho BIOS không bị reset)"
        : "CMOS Battery! (Keeping BIOS clock alive)",
    };
  }
  return {
    badge: "Lv.1",
    icon: "🌀",
    wh: "~1.5 Wh",
    title: isVi
      ? "Khởi động rotor... (vừa đủ nuôi đèn chuột quang)"
      : "Spinning up rotor... (enough for optical mouse LED)",
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
      ? `Đã quay logo ${spinCount} vòng (${ach.wh}) nuôi server nnt25.io.vn. Đạt cấp: [${ach.badge} - ${ach.title.split("(")[0].trim()}]!`
      : `Spun logo ${spinCount} times (${ach.wh}) powering nnt25.io.vn. Tier: [${ach.badge} - ${ach.title.split("(")[0].trim()}]!`;

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
