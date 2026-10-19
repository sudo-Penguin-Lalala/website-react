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
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const updateScrollIndicators = useCallback(() => {
    const el = chipsRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  // Map vertical mouse wheel directly to horizontal scroll on desktop
  useEffect(() => {
    const el = chipsRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 1) {
          const canScrollDown = e.deltaY > 0 && el.scrollLeft < maxScroll - 1;
          const canScrollUp = e.deltaY < 0 && el.scrollLeft > 1;

          if (canScrollDown || canScrollUp) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
            updateScrollIndicators();
          }
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    updateScrollIndicators();

    const timer = setTimeout(updateScrollIndicators, 100);
    window.addEventListener("resize", updateScrollIndicators);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", updateScrollIndicators);
    };
  }, [updateScrollIndicators]);

  // Mouse drag-to-scroll
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const el = chipsRef.current;
    if (!el) return;
    dragStartX.current = e.pageX;
    dragScrollLeft.current = el.scrollLeft;
    hasDragged.current = false;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const el = chipsRef.current;
      if (!el) return;
      const dx = e.pageX - dragStartX.current;
      if (Math.abs(dx) > 3) {
        hasDragged.current = true;
      }
      el.scrollLeft = dragScrollLeft.current - dx;
      updateScrollIndicators();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setTimeout(() => {
        hasDragged.current = false;
      }, 60);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, updateScrollIndicators]);

  const handleChipClick = (cmd) => {
    if (hasDragged.current) return;
    executeCommand(cmd);
  };

  const handleArrowScroll = (direction) => {
    const el = chipsRef.current;
    if (!el) return;
    const distance = el.clientWidth * 0.65;
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
    setTimeout(updateScrollIndicators, 300);
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
