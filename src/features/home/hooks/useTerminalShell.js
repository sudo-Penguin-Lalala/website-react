import { useState, useEffect } from "react";
import * as cmdUtils from "../constants/terminalCommands";

export function useTerminalShell(isVi) {
  const [brandClicks, setBrandClicks] = useState(0);
  const [isSudo, setIsSudo] = useState(false);
  const [sudoHint, setSudoHint] = useState("");
  const [rootOutput, setRootOutput] = useState("");
  const [cmdInput, setCmdInput] = useState("");
  const [pageEffect, setPageEffect] = useState("none");
  const [isReverting, setIsReverting] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingCmd, setExecutingCmd] = useState("");

  // Smooth Matrix rain fade in/out
  useEffect(() => {
    if (pageEffect === "matrix") {
      setShowMatrix(true);
    } else if (showMatrix) {
      const t = setTimeout(() => setShowMatrix(false), 550);
      return () => clearTimeout(t);
    }
  }, [pageEffect, showMatrix]);

  // DevTools Console ASCII Art Banner on mount
  useEffect(() => {
    const banner = `
%c  _   _ _   _ _____ 
 | \\ | | \\ | |_   _|
 |  \\| |  \\| | | |  
 | |\\  | |\\  | | |  
 |_| \\_|_| \\_| |_|  
                    
%c[ nnt@reactor ] %c— Linux Tinkerer & Self-Hosted Infrastructure
%cLooking under the hood? Source: https://github.com/sudo-Penguin-Lalala/website-react
Contact: contact@nnt25.io.vn | Discord: nnt2589
`;
    console.log(
      banner,
      "color: #ffb454; font-family: monospace; font-weight: bold; font-size: 14px;",
      "color: #6ad27f; font-family: monospace; font-weight: bold;",
      "color: #8891a0; font-family: monospace;",
      "color: #d8dee6; font-family: monospace; font-size: 11px;"
    );
  }, []);

  const handleBrandClick = () => {
    if (isSudo) {
      setSudoHint(
        isVi
          ? "[Đang là root! Bấm nút 'exit' để thoát]"
          : "[Root mode active! Use 'exit' button to exit]"
      );
      setTimeout(() => setSudoHint(""), 2500);
      return;
    }

    const nextClicks = brandClicks + 1;
    setBrandClicks(nextClicks);

    if (nextClicks >= 5) {
      setIsSudo(true);
      setBrandClicks(5);
      setSudoHint("");
    } else {
      const remaining = 5 - nextClicks;
      setSudoHint(
        isVi
          ? `[còn ${remaining} lần click nữa...]`
          : `[${remaining} more click${remaining > 1 ? "s" : ""}...]`
      );
    }
  };

  const handleExitSudo = () => {
    if (pageEffect !== "none") {
      setIsReverting(true);
      setTimeout(() => setIsReverting(false), 900);
    }
    setIsSudo(false);
    setBrandClicks(0);
    setRootOutput("");
    setSudoHint("");
    setPageEffect("none");
    setIsExecuting(false);
    setExecutingCmd("");
  };

  const executeCommand = (rawCmd) => {
    const cleanCmd = rawCmd.trim();
    if (!cleanCmd) return;

    const normalized = cleanCmd.toLowerCase().replace(/\s+/g, " ");

    if (normalized === "clear") {
      setRootOutput("");
      setCmdInput("");
      return;
    }

    if (isExecuting) return;

    setIsExecuting(true);
    setExecutingCmd(cleanCmd);
    setCmdInput("");

    setTimeout(() => {
      let output = "";

      if (normalized === "help") {
        output = cmdUtils.getHelpOutput();
      } else if (
        normalized === "uname" ||
        normalized === "uname -a" ||
        normalized.startsWith("uname ")
      ) {
        output = cmdUtils.getUnameOutput();
      } else if (normalized === "whoami") {
        output = cmdUtils.getWhoamiOutput();
      } else if (
        normalized === "free -h" ||
        normalized === "free" ||
        normalized === "free -m" ||
        normalized === "free -g"
      ) {
        output = cmdUtils.getFreeOutput(cleanCmd, isVi);
      } else if (
        normalized === "ls" ||
        normalized === "ls -la" ||
        normalized === "ls -l" ||
        normalized === "ls -a" ||
        normalized === "dir"
      ) {
        output = cmdUtils.getLsOutput(cleanCmd);
      } else if (normalized === "cat flag.txt" || normalized === "cat ./flag.txt") {
        output = cmdUtils.getFlagOutput();
      } else if (
        normalized === "cat classified.env" ||
        normalized === "cat ./classified.env" ||
        normalized === "cat reactor-secret.env" ||
        normalized === "cat secret.env" ||
        normalized === "cat secrets.env"
      ) {
        output = cmdUtils.getClassifiedEnvOutput();
      } else if (normalized === "cat /etc/shadow") {
        output = cmdUtils.getShadowOutput();
      } else if (
        normalized === "rm -rf /" ||
        normalized === "rm -rf /*" ||
        normalized.includes("rm -rf")
      ) {
        output = cmdUtils.getRmRfOutput(cleanCmd, isVi);
      } else if (
        normalized === "systemctl reboot" ||
        normalized === "reboot" ||
        normalized === "init 6"
      ) {
        output = cmdUtils.getRebootOutput(cleanCmd, isVi);
      } else if (normalized === "power" || normalized === "dynamo") {
        output = cmdUtils.getPowerOutput(isVi);
      } else if (normalized === "sl") {
        output = cmdUtils.getSlOutput(isVi);
      } else if (normalized === "matrix") {
        setPageEffect((prev) => (prev === "matrix" ? "none" : "matrix"));
        output =
          `[root@reactor ~]# matrix\n` +
          `🟢 Matrix digital stream toggle engaged. Green phosphor mode online.\n` +
          `Type 'reset' to restore standard terminal display.`;
      } else if (normalized === "invert") {
        setPageEffect((prev) => (prev === "invert" ? "none" : "invert"));
        output =
          `[root@reactor ~]# invert\n` +
          `⚡ Display color polarity inverted. Negative contrast mode active.\n` +
          `Type 'reset' to restore standard terminal display.`;
      } else if (normalized === "flip") {
        setPageEffect((prev) => (prev === "flip" ? "none" : "flip"));
        output =
          `[root@reactor ~]# flip\n` +
          `🙃 Viewport rotated 180 degrees (Australian mirror mode).\n` +
          `Type 'reset' to restore standard terminal display.`;
      } else if (normalized === "party") {
        setPageEffect((prev) => (prev === "party" ? "none" : "party"));
        output =
          `[root@reactor ~]# party\n` +
          `🪩 Reactor party mode activated! Rainbow spectrum strobe running.\n` +
          `Type 'reset' to restore standard terminal display.`;
      } else if (
        normalized === "reset" ||
        normalized === "normal" ||
        normalized === "restore"
      ) {
        if (pageEffect !== "none") {
          setIsReverting(true);
          setTimeout(() => setIsReverting(false), 900);
        }
        setPageEffect("none");
        output =
          `[root@reactor ~]# reset\n` +
          `✓ Visual effects reverted & display calibrated to default NetCheck terminal.`;
      } else {
        output = `bash: ${cleanCmd}: command not found. Type 'help' to see available commands.`;
      }

      setRootOutput(output);
      setIsExecuting(false);
      setExecutingCmd("");
    }, 450);
  };

  const handleRunCommand = (e) => {
    e?.preventDefault();
    executeCommand(cmdInput);
  };

  return {
    isSudo,
    sudoHint,
    handleBrandClick,
    handleExitSudo,
    cmdInput,
    setCmdInput,
    rootOutput,
    setRootOutput,
    isExecuting,
    executingCmd,
    pageEffect,
    isReverting,
    showMatrix,
    executeCommand,
    handleRunCommand,
  };
}
