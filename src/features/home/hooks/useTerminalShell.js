import { useState, useEffect, useRef, useCallback } from "preact/hooks";
import * as cmdUtils from "../constants/terminalCommands";
import { getContactEmail } from "../../../config/links";

export function useTerminalShell(isVi, navigate) {
  const [, setBrandClicks] = useState(0);
  const [isSudo, setIsSudo] = useState(false);
  const [sudoHint, setSudoHint] = useState("");
  const [rootOutput, setRootOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingCmd, setExecutingCmd] = useState("");

  const timersRef = useRef(new Set());

  const registerTimeout = useCallback((fn, delay) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, delay);
    timersRef.current.add(id);
    return id;
  }, []);

  // Teardown all pending timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((id) => clearTimeout(id));
      timers.clear();
    };
  }, []);

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
Contact: ${getContactEmail()} | Discord: nnt2589
`;
    console.log(
      banner,
      "color: #ffb454; font-family: monospace; font-weight: bold; font-size: 14px;",
      "color: #6ad27f; font-family: monospace; font-weight: bold;",
      "color: #8891a0; font-family: monospace;",
      "color: #d8dee6; font-family: monospace; font-size: 11px;"
    );
  }, []);

  const handleBrandClick = useCallback(() => {
    if (isSudo) {
      setSudoHint(
        isVi
          ? "[Đang là root! Bấm nút 'exit' để thoát]"
          : "[Root mode active! Use 'exit' button to exit]"
      );
      registerTimeout(() => setSudoHint(""), 2500);
      return;
    }

    setBrandClicks((prev) => {
      const nextClicks = prev + 1;
      if (nextClicks >= 5) {
        setIsSudo(true);
        setSudoHint("");
        return 5;
      }
      const remaining = 5 - nextClicks;
      setSudoHint(
        isVi
          ? `[còn ${remaining} lần click nữa…]`
          : `[${remaining} more click${remaining > 1 ? "s" : ""}…]`
      );
      return nextClicks;
    });
  }, [isSudo, isVi, registerTimeout]);

  const handleExitSudo = useCallback(() => {
    setIsSudo(false);
    setBrandClicks(0);
    setRootOutput("");
    setSudoHint("");
    setIsExecuting(false);
    setExecutingCmd("");
  }, []);

  const executeCommand = useCallback((rawCmd) => {
    const cleanCmd = rawCmd.trim();
    if (!cleanCmd) return;

    const normalized = cleanCmd.toLowerCase().replace(/\s+/g, " ");

    if (normalized === "clear") {
      setRootOutput("");
      return;
    }

    if (isExecuting) return;

    setIsExecuting(true);
    setExecutingCmd(cleanCmd);

    registerTimeout(() => {
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
        normalized === "blog" ||
        normalized === "posts" ||
        normalized === "logs"
      ) {
        output = cmdUtils.getBlogOutput(isVi);
      } else if (
        normalized === "blog open" ||
        normalized === "posts open" ||
        normalized === "open blog"
      ) {
        output = isVi
          ? `[root@reactor ~]# ${cleanCmd}\nĐang chuyển hướng sang /blog…`
          : `[root@reactor ~]# ${cleanCmd}\nNavigating to /blog…`;
        if (navigate) {
          registerTimeout(() => navigate("/blog"), 300);
        }
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
      } else if (normalized === "fastfetch" || normalized === "neofetch") {
        output = cmdUtils.getFastfetchOutput();
      } else if (normalized === "uptime") {
        output = cmdUtils.getUptimeOutput();
      } else if (normalized === "sl") {
        output = cmdUtils.getSlOutput(isVi);
      } else if (
        normalized === "reset" ||
        normalized === "normal" ||
        normalized === "restore"
      ) {
        output =
          `[root@reactor ~]# reset\n` +
          `✓ Terminal display state calibrated. Screen buffer reset.`;
      } else {
        output = `bash: ${cleanCmd}: command not found. Type 'help' to see available commands.`;
      }

      setRootOutput(output);
      setIsExecuting(false);
      setExecutingCmd("");
    }, 450);
  }, [isExecuting, isVi, navigate, registerTimeout]);

  return {
    isSudo,
    sudoHint,
    handleBrandClick,
    handleExitSudo,
    rootOutput,
    setRootOutput,
    isExecuting,
    executingCmd,
    executeCommand,
  };
}
