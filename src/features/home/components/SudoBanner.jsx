import { useState, useRef, useEffect, useCallback } from "react";
import { QUICK_COMMANDS } from "../constants/homelabData";

const SudoBanner = ({
  handleExitSudo,
  handleRunCommand,
  cmdInput,
  setCmdInput,
  isExecuting,
  executingCmd,
  executeCommand,
  rootOutput,
  setRootOutput,
  isVi,
}) => {
  const chipsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Physics & Animation refs
  const targetScrollRef = useRef(0);
  const rafIdRef = useRef(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const isDraggingRef = useRef(false);

  // Fast indicator update - avoids React re-renders unless boolean state actually toggles
  const updateScrollIndicators = useCallback(() => {
    const el = chipsRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const hasLeft = scrollLeft > 2;
    const hasRight = scrollLeft + clientWidth < scrollWidth - 2;
    setCanScrollLeft((prev) => (prev !== hasLeft ? hasLeft : prev));
    setCanScrollRight((prev) => (prev !== hasRight ? hasRight : prev));
  }, []);

  const cancelAnimation = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  // High refresh rate (60fps/120fps) exponential damping smoothing
  const startSmoothScroll = useCallback(() => {
    cancelAnimation();
    const tick = () => {
      const el = chipsRef.current;
      if (!el) return;
      const current = el.scrollLeft;
      const target = targetScrollRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.5) {
        el.scrollLeft = current + diff * 0.22;
        updateScrollIndicators();
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        el.scrollLeft = target;
        updateScrollIndicators();
        rafIdRef.current = null;
      }
    };
    rafIdRef.current = requestAnimationFrame(tick);
  }, [updateScrollIndicators]);

  // Strict boundary wheel lock: NEVER leaks scroll to parent page, smoothly glides horizontally
  useEffect(() => {
    const el = chipsRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // 100% Trap wheel event on this element - page never scrolls while cursor is here!
      e.preventDefault();

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      if (!rafIdRef.current) {
        targetScrollRef.current = el.scrollLeft;
      }

      // Smooth step with clamping
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current + delta * 1.05));
      startSmoothScroll();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    updateScrollIndicators();

    const timer = setTimeout(updateScrollIndicators, 120);
    window.addEventListener("resize", updateScrollIndicators);

    return () => {
      cancelAnimation();
      clearTimeout(timer);
      el.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", updateScrollIndicators);
    };
  }, [updateScrollIndicators, startSmoothScroll]);

  // Mouse drag-to-scroll with kinetic momentum throw
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const el = chipsRef.current;
    if (!el) return;

    cancelAnimation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.pageX;
    dragStartScrollRef.current = el.scrollLeft;
    targetScrollRef.current = el.scrollLeft;
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const el = chipsRef.current;
      if (!el) return;

      const now = performance.now();
      const dt = now - lastTimeRef.current;
      const dx = e.pageX - lastXRef.current;

      if (dt > 0) {
        // Track velocity (px/frame)
        const instantVel = (dx / dt) * 16.67;
        velocityRef.current = 0.65 * instantVel + 0.35 * velocityRef.current;
      }
      lastXRef.current = e.pageX;
      lastTimeRef.current = now;

      const totalDx = e.pageX - dragStartXRef.current;
      if (Math.abs(totalDx) > 4) {
        hasDraggedRef.current = true;
      }

      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextScroll = Math.max(0, Math.min(maxScroll, dragStartScrollRef.current - totalDx));
      el.scrollLeft = nextScroll;
      targetScrollRef.current = nextScroll;
      updateScrollIndicators();
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      const el = chipsRef.current;
      if (el && Math.abs(velocityRef.current) > 1.2) {
        // Kinetic momentum glide on mouse release
        let currentVel = -velocityRef.current;
        const friction = 0.93;

        const momentumTick = () => {
          if (isDraggingRef.current) return;
          currentVel *= friction;

          if (Math.abs(currentVel) > 0.35) {
            const maxScroll = el.scrollWidth - el.clientWidth;
            const next = el.scrollLeft + currentVel;

            if (next <= 0) {
              el.scrollLeft = 0;
              targetScrollRef.current = 0;
              updateScrollIndicators();
              rafIdRef.current = null;
              return;
            }
            if (next >= maxScroll) {
              el.scrollLeft = maxScroll;
              targetScrollRef.current = maxScroll;
              updateScrollIndicators();
              rafIdRef.current = null;
              return;
            }

            el.scrollLeft = next;
            targetScrollRef.current = next;
            updateScrollIndicators();
            rafIdRef.current = requestAnimationFrame(momentumTick);
          } else {
            rafIdRef.current = null;
          }
        };

        rafIdRef.current = requestAnimationFrame(momentumTick);
      }

      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 70);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, updateScrollIndicators]);

  const handleChipClick = (cmd) => {
    if (hasDraggedRef.current) return;
    executeCommand(cmd);
  };

  const handleArrowScroll = (direction) => {
    const el = chipsRef.current;
    if (!el) return;
    const distance = el.clientWidth * 0.7;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (!rafIdRef.current) {
      targetScrollRef.current = el.scrollLeft;
    }

    targetScrollRef.current =
      direction === "left"
        ? Math.max(0, targetScrollRef.current - distance)
        : Math.min(maxScroll, targetScrollRef.current + distance);

    startSmoothScroll();
  };
  return (
    <div className="nc-sudo-banner">
      <div className="nc-sudo-banner-inner">
        <span className="nc-sudo-badge"># root@reactor</span>
        <button
          type="button"
          className="nc-btn nc-btn-danger nc-btn-exit"
          onClick={handleExitSudo}
          aria-label={isVi ? "Thoát chế độ root" : "Exit root mode"}
        >
          exit [✕]
        </button>
      </div>

      {/* Root Command Line & Quick Chips */}
      <div className="nc-root-cli">
        <form onSubmit={handleRunCommand} className="nc-root-cmd-line">
          <span className="nc-root-prompt">
            <span className="nc-user-root">root@reactor</span>:<span className="nc-path">~</span>#
          </span>
          <input
            type="text"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            placeholder={
              isVi
                ? "gõ lệnh (thử: help, uname -a, matrix, free -h, ls)..."
                : "type command (try: help, uname -a, matrix, free -h, ls)..."
            }
            className="nc-root-cmd-input"
            autoComplete="off"
            spellCheck="false"
            disabled={isExecuting}
            aria-label={isVi ? "Nhập lệnh terminal" : "Terminal command input"}
          />
          <button
            type="submit"
            className="nc-btn nc-btn-danger nc-btn-run"
            disabled={isExecuting}
            aria-label={isVi ? "Thực thi lệnh" : "Execute command"}
          >
            {isExecuting ? "..." : "run ↵"}
          </button>
        </form>

        <div className="nc-root-chips-row">
          <span className="nc-root-chips-label">quick:</span>
          <div className="nc-root-chips-carousel">
            <button
              type="button"
              className={`nc-chips-arrow nc-chips-arrow-left ${canScrollLeft ? "is-active" : ""}`}
              onClick={() => handleArrowScroll("left")}
              disabled={!canScrollLeft}
              aria-label={isVi ? "Cuộn lệnh sang trái" : "Scroll commands left"}
              tabIndex={-1}
            >
              ‹
            </button>
            <div
              className={`nc-root-chips ${isDragging ? "is-dragging" : ""}`}
              ref={chipsRef}
              onMouseDown={handleMouseDown}
              onScroll={updateScrollIndicators}
            >
              {QUICK_COMMANDS.map((item) => (
                <button
                  key={item.cmd}
                  type="button"
                  className="nc-cmd-chip"
                  disabled={isExecuting}
                  onClick={() => handleChipClick(item.cmd)}
                  aria-label={
                    isVi
                      ? `Chạy lệnh ${item.cmd}`
                      : `Run ${item.cmd} command`
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={`nc-chips-arrow nc-chips-arrow-right ${canScrollRight ? "is-active" : ""}`}
              onClick={() => handleArrowScroll("right")}
              disabled={!canScrollRight}
              aria-label={isVi ? "Cuộn lệnh sang phải" : "Scroll commands right"}
              tabIndex={-1}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {isExecuting && (
        <div className="nc-root-executing" role="status" aria-live="polite">
          <span className="nc-spinner-glyph" aria-hidden="true">⚙</span>
          <span>
            {isVi ? `Đang thực thi: ${executingCmd}...` : `Executing: ${executingCmd}...`}
          </span>
        </div>
      )}

      {!isExecuting && rootOutput && (
        <div
          className="nc-root-output"
          role="region"
          aria-label={isVi ? "Kết quả terminal" : "Terminal output"}
          aria-live="polite"
        >
          <div className="nc-root-output-head">
            <span style={{ color: "var(--danger)", fontWeight: 700 }}>
              [TERMINAL OUTPUT]
            </span>
            <button
              type="button"
              className="nc-btn nc-btn-clear"
              onClick={() => setRootOutput("")}
              aria-label={isVi ? "Xóa kết quả terminal" : "Clear terminal output"}
            >
              clear ✕
            </button>
          </div>
          <pre className="nc-pre-output">{rootOutput}</pre>
        </div>
      )}
    </div>
  );
};

export default SudoBanner;
