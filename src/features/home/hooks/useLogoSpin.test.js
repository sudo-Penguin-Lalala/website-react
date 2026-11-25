import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/preact";
import { useLogoSpin, getSpinAchievement } from "./useLogoSpin";

describe("useLogoSpin - Real Hook, Milestones & Storage Fault Tolerance", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getSpinAchievement progression", () => {
    it("calculates correct energy tier for low spin counts", () => {
      const ach = getSpinAchievement(1, false);
      expect(ach.badge).toBe("Lv.1");
      expect(ach.wh).toBe("~1.5 Wh");
      expect(ach.title).toBe("Powering mouse LED");
    });

    it("awards 'Nuôi pin CMOS' at 5 spins milestone", () => {
      const achVi = getSpinAchievement(5, true);
      const achEn = getSpinAchievement(5, false);

      expect(achVi.badge).toBe("Lv.2");
      expect(achVi.title).toBe("Nuôi pin CMOS");
      expect(achVi.wh).toBe("~7.5 Wh");
      expect(achEn.title).toBe("Keeping CMOS alive");
    });

    it("awards 'Sạc xe máy điện' at 300 spins milestone", () => {
      const achVi = getSpinAchievement(300, true);
      const achEn = getSpinAchievement(300, false);

      expect(achVi.badge).toBe("MAX");
      expect(achVi.title).toBe("Sạc xe máy điện chạy 500m");
      expect(achVi.wh).toBe("~450 Wh");
      expect(achEn.title).toBe("Enough to charge e-scooter");
    });

    it("awards 'Động cơ vĩnh cửu' at 1000 spins milestone", () => {
      const achVi = getSpinAchievement(1000, true);
      const achEn = getSpinAchievement(1000, false);

      expect(achVi.badge).toBe("PERPETUAL");
      expect(achVi.title).toBe("Động cơ vĩnh cửu");
      expect(achVi.wh).toBe("~1.5 kWh");
      expect(achEn.title).toBe("Perpetual motion");
    });
  });

  describe("useLogoSpin() hook behavior & fault tolerance", () => {
    it("falls back to 0 and warns cleanly when localStorage throws SecurityError/QuotaExceededError", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new DOMException("Restricted storage", "SecurityError");
      });
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      });

      const { result } = renderHook(() => useLogoSpin());
      expect(result.current.spinCount).toBe(0);
      expect(result.current.lifetimeSpins).toBe(0);
      expect(result.current.bestRecord).toBe(0);

      act(() => {
        result.current.handleSpinLogo();
      });

      expect(result.current.spinCount).toBe(1);
      expect(result.current.spinDeg).toBe(720);
      expect(result.current.lifetimeSpins).toBe(1);
      expect(result.current.bestRecord).toBe(1);
      expect(warnSpy).toHaveBeenCalled();
    });

    it("only sets copied=true when clipboard writeText resolves, and does not fake success on reject", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: vi.fn().mockRejectedValueOnce(new Error("Permission denied")),
        },
      });

      const { result } = renderHook(() => useLogoSpin());
      await act(async () => {
        result.current.copyReceipt(false);
        await Promise.resolve();
      });

      expect(result.current.copied).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
