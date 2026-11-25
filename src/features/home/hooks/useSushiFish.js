import { useState, useRef, useEffect } from "preact/hooks";
import { FISH_SPECIES } from "../constants/homelabData";

export function useSushiFish(isVi) {
  const [fishIndex, setFishIndex] = useState(0);
  const [fishWiggling, setFishWiggling] = useState(false);
  const [sushiEats, setSushiEats] = useState(0);
  const [fishNotice, setFishNotice] = useState("");

  const fishTimerRef = useRef(null);
  const wiggleTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (fishTimerRef.current) clearTimeout(fishTimerRef.current);
      if (wiggleTimerRef.current) clearTimeout(wiggleTimerRef.current);
    };
  }, []);

  const handleFishClick = () => {
    setFishWiggling(true);
    if (wiggleTimerRef.current) clearTimeout(wiggleTimerRef.current);
    wiggleTimerRef.current = setTimeout(() => setFishWiggling(false), 400);

    const isLast = fishIndex >= FISH_SPECIES.length - 1;
    if (isLast) {
      const nextEats = sushiEats + 1;
      setSushiEats(nextEats);
      const msgsVi = [
        "*nhai* 🍣 Cá thành sushi hồi rồi.",
        "*nhai tiếp* 🍣 Thêm miếng nữa, ăn dính phết.",
        "*ợ* 🍣 Hết cá rồi, no căng bụng.",
      ];
      const msgsEn = [
        "*nom nom* 🍣 Fresh salmon nigiri.",
        "*chew chew* 🍣 Another piece, can't stop.",
        "*burp* 🍣 That's all the fish, belly's full.",
      ];
      const msgList = isVi ? msgsVi : msgsEn;
      setFishNotice(msgList[(nextEats - 1) % msgList.length]);

      if (fishTimerRef.current) {
        clearTimeout(fishTimerRef.current);
      }
      fishTimerRef.current = setTimeout(() => {
        setFishNotice("");
      }, 5000);
      return;
    }

    setFishIndex((prev) => Math.min(FISH_SPECIES.length - 1, prev + 1));
  };

  return {
    fishIndex,
    fishWiggling,
    sushiEats,
    fishNotice,
    handleFishClick,
  };
}
