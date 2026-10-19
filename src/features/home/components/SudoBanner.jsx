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
  return (
    <div className="nc-sudo-banner">
      <div className="nc-sudo-banner-inner">
        <span className="nc-sudo-badge"># root@reactor</span>
        <button
          type="button"
          className="nc-btn nc-btn-danger"
          onClick={handleExitSudo}
          aria-label={isVi ? "Thoát chế độ root" : "Exit root mode"}
        >
          exit [✕]
        </button>
      </div>

      {/* Root Command Line & Quick Chips */}
      <div className="nc-root-cli">
        <form onSubmit={handleRunCommand} className="nc-root-cmd-line">
          <span className="nc-user-root">root@reactor</span>:<span className="nc-path">~</span>#
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
            className="nc-btn nc-btn-danger"
            style={{ padding: "0.2rem 0.55rem", fontSize: "0.75rem" }}
            disabled={isExecuting}
            aria-label={isVi ? "Thực thi lệnh" : "Execute command"}
          >
            {isExecuting ? "..." : "run ↵"}
          </button>
        </form>

        <div className="nc-root-chips">
          <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>quick:</span>
          {QUICK_COMMANDS.map((item) => (
            <button
              key={item.cmd}
              type="button"
              className="nc-cmd-chip"
              disabled={isExecuting}
              onClick={() => executeCommand(item.cmd)}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.4rem",
            }}
          >
            <span style={{ color: "var(--danger)", fontWeight: 700 }}>
              [TERMINAL OUTPUT]
            </span>
            <button
              type="button"
              className="nc-btn"
              style={{ padding: "0.1rem 0.45rem", fontSize: "0.72rem" }}
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
