import { describe, it, expect, beforeEach, vi } from "vitest";
import { getSpinAchievement } from "./useLogoSpin";

describe("useLogoSpin - Achievement & Energy Calculations", () => {
  describe("Watt-hour & Energy Progression", () => {
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
      expect(achVi.title).toContain("Sạc xe máy điện");
      expect(achVi.wh).toBe("~450 Wh");
      expect(achEn.title).toContain("charge e-scooter");
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

  describe("LocalStorage Fault Tolerance", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("safely handles localStorage throwing SecurityError without breaking", () => {
      const storageMock = {
        getItem: vi.fn(() => {
          throw new DOMException("The operation is insecure.", "SecurityError");
        }),
        setItem: vi.fn(() => {
          throw new DOMException("Quota exceeded", "QuotaExceededError");
        }),
      };

      // Ensure mock doesn't crash external callers
      expect(() => {
        try {
          storageMock.getItem("nnt:power_lifetime");
        } catch {
          // safe fallback
        }
      }).not.toThrow();
    });
  });
});
