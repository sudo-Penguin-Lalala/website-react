import { useState, useRef, useEffect, useCallback } from "preact/hooks";
import { QUICK_COMMANDS } from "../constants/homelabData";

const SudoBanner = ({
  handleExitSudo,
  isExecuting,
  executingCmd,
  executeCommand,
  rootOutput,
  setRootOutput,
  isVi,
}) => {
  const chipsRef = useRef(null);
  const [cmdInput, setCmdInput] = useState("");
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

  const mouseListenersRef = useRef(null);
  const dragResetTimerRef = useRef(null);

  // Initialize scroll indicators and respond to resize (Native browser scrolling, zero wheel hijacking)
  useEffect(() => {
    updateScrollIndicators();

    const timer = setTimeout(updateScrollIndicators, 120);
    window.addEventListener("resize", updateScrollIndicators);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      clearTimeout(timer);
      if (dragResetTimerRef.current) {
        clearTimeout(dragResetTimerRef.current);
        dragResetTimerRef.current = null;
      }
      window.removeEventListener("resize", updateScrollIndicators);
      if (mouseListenersRef.current) {
        mouseListenersRef.current();
        mouseListenersRef.current = null;
      }
    };
  }, [updateScrollIndicators]);

  // Mouse drag-to-scroll with kinetic momentum throw
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const el = chipsRef.current;
    if (!el) return;

    cancelAnimation();
    if (dragResetTimerRef.current) {
      clearTimeout(dragResetTimerRef.current);
      dragResetTimerRef.current = null;
    }
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.pageX;
    dragStartScrollRef.current = el.scrollLeft;
    targetScrollRef.current = el.scrollLeft;
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const el = chipsRef.current;
      if (!el) return;

      const totalDx = moveEvent.pageX - dragStartXRef.current;

      // Only enter drag mode if moved more than 8 pixels (prevents clicks from becoming drags)
      if (!hasDraggedRef.current && Math.abs(totalDx) > 8) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }

      if (hasDraggedRef.current) {
        const now = performance.now();
        const dt = now - lastTimeRef.current;
        const dx = moveEvent.pageX - lastXRef.current;

        if (dt > 0) {
          const instantVel = (dx / dt) * 16.67;
          velocityRef.current = 0.65 * instantVel + 0.35 * velocityRef.current;
        }
        lastXRef.current = moveEvent.pageX;
        lastTimeRef.current = now;

        const maxScroll = el.scrollWidth - el.clientWidth;
        const nextScroll = Math.max(0, Math.min(maxScroll, dragStartScrollRef.current - totalDx));
        el.scrollLeft = nextScroll;
        targetScrollRef.current = nextScroll;
        updateScrollIndicators();
      }
    };

    const cleanupDragListeners = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("blur", handleMouseUp);
      window.removeEventListener("pointercancel", handleMouseUp);
      mouseListenersRef.current = null;
    };

    const handleMouseUp = () => {
      cleanupDragListeners();

      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      if (hasDraggedRef.current) {
        // Kinetic momentum glide if user flicked during drag
        const el = chipsRef.current;
        if (el && Math.abs(velocityRef.current) > 1.2) {
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

        // Keep hasDraggedRef true briefly to swallow the synthetic click from the drag
        if (dragResetTimerRef.current) clearTimeout(dragResetTimerRef.current);
        dragResetTimerRef.current = setTimeout(() => {
          dragResetTimerRef.current = null;
          hasDraggedRef.current = false;
        }, 80);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("blur", handleMouseUp);
    window.addEventListener("pointercancel", handleMouseUp);
    mouseListenersRef.current = cleanupDragListeners;
  };

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

  const onFormSubmit = (e) => {
    e?.preventDefault();
    if (executeCommand) {
      const cmd = cmdInput.trim();
      if (!cmd || isExecuting) return;
      setCmdInput("");
      executeCommand(cmd);
    }
  };

  return (
    <div className="nc-sudo-banner">
      <div className="nc-sudo-banner-inner">
        <div className="nc-card-head-left">
          <div className="nc-window-controls" aria-hidden="true">
            <span className="nc-win-dot nc-win-close" />
            <span className="nc-win-dot nc-win-min" />
            <span className="nc-win-dot nc-win-max" />
          </div>
          <span className="nc-sudo-badge"># root@reactor</span>
        </div>
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
        <form onSubmit={onFormSubmit} className="nc-root-cmd-line">
          <span className="nc-root-prompt">
            <span className="nc-user-root">root@reactor</span>:<span className="nc-path">~</span>#
          </span>
          <input
            type="text"
            name="cmd"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            placeholder={
              isVi
                ? "gõ lệnh (thử: help, uname -a, fastfetch, free -h, ls)…"
                : "type command (try: help, uname -a, fastfetch, free -h, ls)…"
            }
            className="nc-root-cmd-input"
            autoComplete="off"
            spellCheck="false"
            readOnly={isExecuting}
            aria-label={isVi ? "Nhập lệnh terminal" : "Terminal command input"}
          />
          <button
            type="submit"
            className="nc-btn nc-btn-danger nc-btn-run"
            disabled={isExecuting}
            aria-label={isVi ? "Thực thi lệnh" : "Execute command"}
          >
            {isExecuting ? "…" : "run ↵"}
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
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
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
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isExecuting && (
        <div className="nc-root-executing" role="status" aria-live="polite">
          <svg
            className="nc-spinner-glyph"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>
            {isVi ? `Đang thực thi: ${executingCmd}…` : `Executing: ${executingCmd}…`}
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
