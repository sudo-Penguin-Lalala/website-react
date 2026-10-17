import { useState, useEffect, useRef } from "react";
import { useI18n } from "../i18n/useI18n";
import Icon from "../components/Icon";
import avatar224 from "../assets/avatar-224.png";
import avatar448 from "../assets/avatar-448.png";
import avatar224Webp from "../assets/avatar-224.webp";
import avatar448Webp from "../assets/avatar-448.webp";
import { profileData } from "../config/links";
import "./HomeV2.css";

const PERSON_TAGS = [
  "the most annoying person :D",
  "DNS was the problem, again",
  "breaking prod on Friday :)",
  "self-hosting everything just because",
  "rm -rf /* survivor",
  "yaml indentation sufferer",
  "docker restart always",
  "still stuck in vim",
  "ping -c 4 1.1.1.1 addict",
];

const FISH_SPECIES = [
  { emoji: "🐟", name: "fish" },
  { emoji: "🐠", name: "tropical" },
  { emoji: "🐡", name: "blowfish" },
  { emoji: "🦈", name: "shark" },
  { emoji: "🎣", name: "caught" },
  { emoji: "🍱", name: "bento" },
  { emoji: "🍣", name: "sushi" },
];

const MatrixCanvas = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜNNT_REACTOR";
    const fontSize = 14;
    const columns = Math.max(1, Math.floor(canvas.width / fontSize));
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 14, 20, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`nc-matrix-canvas ${active ? "is-active" : "is-leaving"}`}
      aria-hidden="true"
    />
  );
};

const HomeV2 = () => {
  const { lang, t, toggle } = useI18n();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [brandClicks, setBrandClicks] = useState(0);
  const [isSudo, setIsSudo] = useState(false);
  const [sudoHint, setSudoHint] = useState("");
  const [tagIndex, setTagIndex] = useState(0);
  const [fishIndex, setFishIndex] = useState(0);
  const [fishWiggling, setFishWiggling] = useState(false);
  const [sushiEats, setSushiEats] = useState(0);
  const [fishNotice, setFishNotice] = useState("");
  const [rootOutput, setRootOutput] = useState("");
  const [cmdInput, setCmdInput] = useState("");
  const [pageEffect, setPageEffect] = useState("none");
  const [isReverting, setIsReverting] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingCmd, setExecutingCmd] = useState("");
  const [spinDeg, setSpinDeg] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinBadgeVisible, setIsSpinBadgeVisible] = useState(false);
  const [isSpinBadgeLeaving, setIsSpinBadgeLeaving] = useState(false);

  const fishTimerRef = useRef(null);
  const spinIdleTimerRef = useRef(null);
  const spinResetTimerRef = useRef(null);

  const getSpinAchievement = (count, vi) => {
    if (count >= 50) {
      return {
        badge: "MAX",
        icon: "🏆",
        title: vi ? "Động cơ Vĩnh cửu!" : "Perpetual Motion Machine!",
      };
    }
    if (count >= 25) {
      return {
        badge: "Lv.4",
        icon: "🚀",
        title: vi ? "Rotor ép xung!" : "Overclocked Rotor!",
      };
    }
    if (count >= 10) {
      return {
        badge: "Lv.3",
        icon: "💫",
        title: vi ? "Bậc thầy ly tâm!" : "Centrifugal Master!",
      };
    }
    if (count >= 5) {
      return {
        badge: "Lv.2",
        icon: "⚡",
        title: vi ? "Máy phát điện động năng!" : "Kinetic Generator!",
      };
    }
    return {
      badge: "Lv.1",
      icon: "🌀",
      title: vi ? "Khởi động rotor!" : "Rotor Online!",
    };
  };

  // Smooth Matrix rain fade in/out
  useEffect(() => {
    if (pageEffect === "matrix") {
      setShowMatrix(true);
    } else if (showMatrix) {
      const t = setTimeout(() => setShowMatrix(false), 550);
      return () => clearTimeout(t);
    }
  }, [pageEffect, showMatrix]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (fishTimerRef.current) clearTimeout(fishTimerRef.current);
      if (spinIdleTimerRef.current) clearTimeout(spinIdleTimerRef.current);
      if (spinResetTimerRef.current) clearTimeout(spinResetTimerRef.current);
    };
  }, []);

  const handleSpinLogo = () => {
    const nextDeg = spinDeg + 720;
    const nextCount = spinCount + 1;
    setSpinDeg(nextDeg);
    setSpinCount(nextCount);
    setIsSpinBadgeVisible(true);
    setIsSpinBadgeLeaving(false);

    // Cancel any pending idle fade/reset
    if (spinIdleTimerRef.current) clearTimeout(spinIdleTimerRef.current);
    if (spinResetTimerRef.current) clearTimeout(spinResetTimerRef.current);

    // Stay steadily visible while spinning; after 5s of idle, fade out and reset achievement
    spinIdleTimerRef.current = setTimeout(() => {
      setIsSpinBadgeLeaving(true);
      spinResetTimerRef.current = setTimeout(() => {
        setIsSpinBadgeVisible(false);
        setIsSpinBadgeLeaving(false);
        setSpinCount(0); // Reset achievement so it can be earned again!
      }, 450);
    }, 5000);
  };

  // Easter Egg: DevTools Console ASCII Art Banner
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

  const handleCopyEmail = (e) => {
    e?.preventDefault();
    navigator.clipboard?.writeText("contact@nnt25.io.vn");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyDiscord = (e) => {
    e?.preventDefault();
    navigator.clipboard?.writeText("nnt2589");
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  const handleBrandClick = () => {
    if (isSudo) {
      setSudoHint(
        lang === "vi"
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
        lang === "vi"
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

  const handleTagClick = () => {
    setTagIndex((prev) => (prev + 1) % PERSON_TAGS.length);
  };

  const handleFishClick = () => {
    setFishWiggling(true);
    setTimeout(() => setFishWiggling(false), 400);

    const isLast = fishIndex >= FISH_SPECIES.length - 1;
    if (isLast) {
      const nextEats = sushiEats + 1;
      setSushiEats(nextEats);
      const msgsVi = [
        "*mlem mlem* 🍣 Cá đã thành sushi cá hồi tươi roi rói!",
        "*nhai nhai* 🍣 Thêm miếng nữa! Càng ăn càng cuốn!",
        "*ợ* 🍣 No căng bụng rồi! Hết cá rồi bạn ơi :D",
      ];
      const msgsEn = [
        "*nom nom* 🍣 The fish turned into fresh salmon nigiri!",
        "*chew chew* 🍣 Another delicious bite! Can't stop!",
        "*burp* 🍣 Belly is full! No more fish left, you ate them all :D",
      ];
      const msgList = lang === "vi" ? msgsVi : msgsEn;
      setFishNotice(msgList[(nextEats - 1) % msgList.length]);

      // Clear any prior timer so subsequent clicks get the full fresh 5 seconds
      if (fishTimerRef.current) {
        clearTimeout(fishTimerRef.current);
      }
      fishTimerRef.current = setTimeout(() => {
        setFishNotice("");
      }, 5000);
      return;
    }

    setFishIndex((prev) => prev + 1);
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

    // Simulate realistic terminal command execution delay
    setTimeout(() => {
      let output = "";

      if (normalized === "help") {
        output =
          `[root@reactor ~]# help\n` +
          `Reactor Root Shell v2.0 - Available Commands:\n\n` +
          `  [System Info & Diagnostics]\n` +
          `  • uname -a            Print kernel version & CPU architecture\n` +
          `  • whoami              Show current operator privileges & UID/GID\n` +
          `  • free -h             Check system memory & swap statistics\n` +
          `  • ls -la              List directory contents and file modes\n` +
          `  • cat flag.txt        Read homelab privilege escalation flag\n` +
          `  • cat classified.env  Inspect sanitized reactor environment vars\n\n` +
          `  [System Controls]\n` +
          `  • rm -rf /            Test Reactor Homelab Safety Guard defense\n` +
          `  • systemctl reboot    Trigger simulated container node reboot\n` +
          `  • cat /etc/shadow     Read mock encrypted shadow file\n` +
          `  • clear               Clear terminal screen buffer\n\n` +
          `  [Visual Effects - Root Powers]\n` +
          `  • matrix              Toggle Matrix digital rain & phosphor green\n` +
          `  • invert              Reverse display color polarity\n` +
          `  • glitch              Trigger CRT monitor scanline interference\n` +
          `  • flip                Australian 180° upside-down viewport\n` +
          `  • party               Engage reactor disco spectrum strobe\n` +
          `  • reset               Clear all visual effects & restore normal view`;
      } else if (
        normalized === "uname" ||
        normalized === "uname -a" ||
        normalized.startsWith("uname ")
      ) {
        output =
          `[root@reactor ~]# uname -a\n` +
          `Linux reactor 6.12.0-206.104.4.4.el10uek.aarch64 #1 SMP PREEMPT_DYNAMIC aarch64 GNU/Linux`;
      } else if (normalized === "whoami") {
        output =
          `[root@reactor ~]# whoami\n` +
          `root (uid=0 gid=0) · operator status: active · all nodes online`;
      } else if (
        normalized === "free -h" ||
        normalized === "free" ||
        normalized === "free -m" ||
        normalized === "free -g"
      ) {
        output =
          `[root@reactor ~]# ${cleanCmd}\n` +
          `               total        used        free      shared  buff/cache   available\n` +
          `Mem:           128Ti        0.0B       128Ti        0.0B        0.0B       128Ti\n` +
          `Swap:          512Ti        0.0B       512Ti\n\n` +
          `Notice: 128 TiB RAM successfully downloaded from downloadmoreram.com 🚀\n\n` +
          (lang === "vi"
            ? `⚠️ [CẢNH BÁO BẢO MẬT & ĐÍNH CHÍNH]:\n` +
              `Đây là trò đùa (meme) kinh điển của giới sysadmin — RAM là linh kiện phần cứng, KHÔNG THỂ tải qua mạng!\n` +
              `TUYỆT ĐỐI KHÔNG bấm tải hoặc chạy file từ các website "download RAM" ngoài đời thực. Chúng là lừa đảo hoặc cài mã độc!`
            : `⚠️ [CRITICAL WARNING & DISCLAIMER]:\n` +
              `This is an ancient sysadmin meme — RAM is physical hardware, you CANNOT download it from the internet!\n` +
              `DO NOT download or run executable files from "free RAM" websites in real life. They are scam or malware traps!`);
      } else if (
        normalized === "ls" ||
        normalized === "ls -la" ||
        normalized === "ls -l" ||
        normalized === "ls -a" ||
        normalized === "dir"
      ) {
        output =
          `[root@reactor ~]# ${cleanCmd}\n` +
          `total 36\n` +
          `drwx------ 4 root root 4096 Oct 17 18:25 .\n` +
          `drwxr-xr-x 19 root root 4096 Oct 17 00:00 ..\n` +
          `-rw------- 1 root root  420 Oct 17 12:00 .bash_history\n` +
          `drwx------ 2 root root 4096 Oct 17 12:00 .ssh\n` +
          `-rw-r--r-- 1 root root  256 Oct 17 18:25 classified.env\n` +
          `-rw-r--r-- 1 root root 1337 Oct 17 18:25 flag.txt`;
      } else if (normalized === "cat flag.txt" || normalized === "cat ./flag.txt") {
        output =
          `[root@reactor ~]# cat flag.txt\n` +
          `nnt{r00t_m0d3_3sc4l4t10n_succ3ssful_oci_1001} 🏆`;
      } else if (
        normalized === "cat classified.env" ||
        normalized === "cat ./classified.env" ||
        normalized === "cat reactor-secret.env" ||
        normalized === "cat secret.env" ||
        normalized === "cat secrets.env"
      ) {
        output =
          `[root@reactor ~]# cat classified.env\n` +
          `# ============================================================\n` +
          `# TOP SECRET REACTOR OPERATOR SECRETS (100% FICTIONAL MEMES)\n` +
          `# Real homelab infrastructure & keys are 100% encrypted & safe\n` +
          `# ============================================================\n` +
          `OPERATOR_CAFFEINE_LEVEL=0% (CRITICAL: operator needs espresso immediately)\n` +
          `FAVORITE_DISTRO=arch_linux_btw\n` +
          `PIZZA_ORDERING_API=extra_cheese_pepperoni_enabled\n` +
          `DNS_ROOT_CAUSE=always_the_dns\n` +
          `YAML_INDENTATION_ERRORS=4294967295\n` +
          `CAT_SLEEPING_ON_KEYBOARD=true\n` +
          `WHY_SELF_HOST=because_the_cloud_is_just_someone_elses_computer\n` +
          `REAL_SECRETS_LEAKED=0 (zero leaks, privacy first 🛡️)`;
      } else if (normalized === "cat /etc/shadow") {
        output =
          `[root@reactor ~]# cat /etc/shadow\n` +
          `root:$6$reactor$k8s_is_bloated_use_compose:19700:0:99999:7:::\n` +
          `nnt:$6$oracle$homelab_master_key_never_share:19700:0:99999:7:::\n` +
          `fish:$6$ocean$salmon_sushi_delicious_10/10:19700:0:99999:7:::`;
      } else if (
        normalized === "rm -rf /" ||
        normalized === "rm -rf /*" ||
        normalized.includes("rm -rf")
      ) {
        output = lang === "vi"
          ? `[root@reactor /]# ${cleanCmd}\n` +
            `⚠️ rm: cannot remove '/': Permission denied by Reactor Homelab Safety Guard 🛡️\n` +
            `Nice try hacker! Toàn bộ container, cấu hình và dữ liệu của Thien vẫn an toàn nguyên vẹn :)`
          : `[root@reactor /]# ${cleanCmd}\n` +
            `⚠️ rm: cannot remove '/': Permission denied by Reactor Homelab Safety Guard 🛡️\n` +
            `Nice try hacker! All containers, configs, and storage are safe and sound :)`;
      } else if (
        normalized === "systemctl reboot" ||
        normalized === "reboot" ||
        normalized === "init 6"
      ) {
        output = lang === "vi"
          ? `[root@reactor ~]# ${cleanCmd}\n` +
            `Broadcast message from root@reactor (pts/0):\n` +
            `The system is going down for reboot NOW!\n` +
            `... Khởi động lại thành công! Uptime: 0 days, 0 hours, 1 second (ảo ma Canada ✨)`
          : `[root@reactor ~]# ${cleanCmd}\n` +
            `Broadcast message from root@reactor (pts/0):\n` +
            `The system is going down for reboot NOW!\n` +
            `... System rebooted cleanly! Uptime: 0 days, 0 hours, 1 second (just kidding ✨)`;
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
      } else if (normalized === "glitch") {
        setPageEffect((prev) => (prev === "glitch" ? "none" : "glitch"));
        output =
          `[root@reactor ~]# glitch\n` +
          `⚡ CRT visual scanline malfunction simulated! Signal drifting.\n` +
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

  const isVi = lang === "vi";

  return (
    <div
      className={`nc-term ${pageEffect !== "none" ? `effect-${pageEffect}` : ""} ${
        isReverting ? "is-reverting" : ""
      }`}
    >
      {showMatrix && <MatrixCanvas active={pageEffect === "matrix"} />}

      <div className="nc-container">
        {/* Brand Header */}
        <header className="nc-hdr">
          <div className="nc-brand-wrap">
            <button
              type="button"
              className={`nc-brand-btn ${isSudo ? "is-sudo" : ""}`}
              onClick={handleBrandClick}
              title={
                isSudo
                  ? (isVi ? "Chế độ root đang kích hoạt! Bấm nút 'exit' để thoát" : "Root mode active! Use 'exit' button to exit")
                  : (isVi ? "Chạm 5 lần để leo quyền root (sudo)" : "Tap 5 times to escalate to root (sudo)")
              }
              translate="no"
            >
              <h1 className="nc-brand">
                <span className="nc-bracket">[</span>
                {isSudo ? (
                  <span className="nc-brand-root">root#reactor</span>
                ) : (
                  <span>NNT</span>
                )}
                <span className={`nc-cursor ${isSudo ? "nc-cursor-root" : ""}`}>_</span>
                <span className="nc-bracket">]</span>
              </h1>
            </button>
            {sudoHint && <span className="nc-sudo-hint">{sudoHint}</span>}
          </div>

          <div className="nc-hdr-actions">
            <button
              type="button"
              className="nc-btn"
              onClick={toggle}
              aria-label={t.languageToggleAria}
              title="Switch Language"
            >
              <span>{t.flag}</span>
              <span>{isVi ? "VI" : "EN"}</span>
            </button>
          </div>
        </header>

        {/* Sudo Privilege Escalation Banner & Playground */}
        {isSudo && (
          <div className="nc-sudo-banner">
            <div className="nc-sudo-banner-inner">
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <span className="nc-sudo-badge"># root@reactor</span>
                <span style={{ color: "#ff9999", fontSize: "0.82rem" }}>
                  {isVi ? "chế độ superuser đang bật" : "superuser mode active"}
                </span>
              </div>
              <button
                type="button"
                className="nc-btn nc-btn-danger"
                onClick={handleExitSudo}
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
                  placeholder={isVi ? "gõ lệnh (thử: help, uname -a, matrix, free -h, ls)..." : "type command (try: help, uname -a, matrix, free -h, ls)..."}
                  className="nc-root-cmd-input"
                  autoComplete="off"
                  spellCheck="false"
                  disabled={isExecuting}
                />
                <button
                  type="submit"
                  className="nc-btn nc-btn-danger"
                  style={{ padding: "0.2rem 0.55rem", fontSize: "0.75rem" }}
                  disabled={isExecuting}
                >
                  {isExecuting ? "..." : "run ↵"}
                </button>
              </form>

              <div className="nc-root-chips">
                <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>quick:</span>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("help")}>
                  $ help
                </button>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("uname -a")}>
                  $ uname -a
                </button>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("free -h")}>
                  $ free -h
                </button>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("ls -la")}>
                  $ ls -la
                </button>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("cat flag.txt")}>
                  $ cat flag.txt
                </button>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("matrix")}>
                  $ matrix 🟢
                </button>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("glitch")}>
                  $ glitch ⚡
                </button>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("invert")}>
                  $ invert ☯
                </button>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("flip")}>
                  $ flip 🙃
                </button>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("party")}>
                  $ party 🪩
                </button>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("reset")}>
                  $ reset ✕
                </button>
                <button type="button" className="nc-cmd-chip" disabled={isExecuting} onClick={() => executeCommand("rm -rf /")}>
                  $ rm -rf /
                </button>
              </div>
            </div>

            {isExecuting && (
              <div className="nc-root-executing">
                <span className="nc-spinner-glyph">⚙</span>
                <span>
                  {isVi ? `Đang thực thi: ${executingCmd}...` : `Executing: ${executingCmd}...`}
                </span>
              </div>
            )}

            {!isExecuting && rootOutput && (
              <div className="nc-root-output">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ color: "var(--danger)", fontWeight: 700 }}>[TERMINAL OUTPUT]</span>
                  <button
                    type="button"
                    className="nc-btn"
                    style={{ padding: "0.1rem 0.45rem", fontSize: "0.72rem" }}
                    onClick={() => setRootOutput("")}
                  >
                    clear ✕
                  </button>
                </div>
                <pre className="nc-pre-output">{rootOutput}</pre>
              </div>
            )}
          </div>
        )}

        {/* Card 1: Identity & Bio (> whoami) */}
        <section className={`nc-card ${isSudo ? "is-root-card" : ""}`}>
          <header className="nc-card-head">
            <h2 className="nc-card-title">
              <span className="nc-prompt-glyph">&gt;</span> whoami {isSudo ? "--elevated" : ""}
            </h2>
            <span className={`nc-card-status ${isSudo ? "nc-status-root" : ""}`}>
              {isSudo ? "uid=0(root) gid=0(root) [SUPERUSER]" : "uid=1001(nnt) gid=1001(nnt)"}
            </span>
          </header>
          <div className="nc-card-body">
            <div className="nc-profile-layout">
              <div className={`nc-avatar-frame ${isSudo ? "is-root" : ""}`}>
                {isSudo && <span className="nc-avatar-root-badge"># ROOT</span>}
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`${avatar224Webp} 1x, ${avatar448Webp} 2x`}
                  />
                  <img
                    src={avatar224}
                    srcSet={`${avatar448} 2x`}
                    alt={profileData.avatar.alt}
                    width="88"
                    height="88"
                  />
                </picture>
              </div>

              <div className="nc-profile-text">
                <h2>
                  {t.profile.name}{" "}
                  <button
                    type="button"
                    className="nc-tag nc-tag-accent nc-tag-interactive"
                    onClick={handleTagClick}
                    title={isVi ? "Bấm để đổi danh hiệu!" : "Click to cycle titles!"}
                    style={{ verticalAlign: "middle", fontWeight: 600 }}
                  >
                    {isSudo ? "OPERATOR 🛡️" : PERSON_TAGS[tagIndex]}
                  </button>
                </h2>
                <p className="nc-profile-bio">
                  {isSudo ? (
                    <span style={{ color: "#ff9999" }}>
                      {isVi
                        ? "⚡ QUYỀN ROOT ĐÃ KÍCH HOẠT! Đặc quyền tối cao: không cần nhớ cú pháp cờ lệnh Docker Compose. Operator đang kiểm soát toàn cụm reactor."
                        : "⚡ ROOT PRIVILEGES ACTIVE! Ultimate perk: zero obligation to remember Docker flags. Operator access active across the reactor fleet."}
                    </span>
                  ) : (
                    isVi
                      ? "Linux tinkerer & đam mê hạ tầng tự host mã nguồn mở từ năm 14 tuổi. Mình tự host để bảo vệ quyền riêng tư, xây dựng hệ thống, phá nó rồi tìm cách làm nó chạy nhanh hơn."
                      : "Linux tinkerer & open-source infrastructure enjoyer. Native Linux user since 14. I focus on building privacy-first network architectures, containerised deployments, and automated self-hosted setups."
                  )}
                </p>
                <div className="nc-tag-list">
                  {isSudo && (
                    <span
                      className="nc-tag"
                      style={{ borderColor: "var(--danger)", color: "var(--danger)", background: "rgba(255,107,107,0.15)", fontWeight: 700 }}
                    >
                      # SUDOER
                    </span>
                  )}
                  <span className="nc-tag nc-tag-accent">Oracle Linux 10</span>
                  <span className="nc-tag">WireGuard / HY2</span>
                  <span className="nc-tag">Stalwart Mail</span>
                  <span className="nc-tag">Cloudflare Zero Trust</span>
                  <span className="nc-tag">Docker Infrastructure</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: Fastfetch Homelab Architecture (> fastfetch --homelab) */}
        <section className={`nc-card ${isSudo ? "is-root-card" : ""}`}>
          <header className="nc-card-head">
            <h2 className="nc-card-title">
              <span className="nc-prompt-glyph">&gt;</span> fastfetch --homelab {isSudo ? "--root" : ""}
            </h2>
          </header>
          <div className="nc-card-body">
            <div className="nc-fastfetch-block">
              <div className="nc-term-prompt">
                {isSudo ? (
                  <>
                    <span className="nc-user-root">root@reactor</span>:<span className="nc-path">~</span># fastfetch --homelab --root
                  </>
                ) : (
                  <>
                    <span className="nc-user">nnt@reactor</span>:<span className="nc-path">~</span>$ fastfetch --homelab
                  </>
                )}
              </div>
              <div className="nc-ff-grid">
                <span className="nc-ff-label">Platform:</span>
                <span className="nc-ff-val">Oracle Cloud A1 ARM64</span>

                <span className="nc-ff-label">OS / Kernel:</span>
                <span className="nc-ff-val">Oracle Linux 10 · Linux 6.12 UEK</span>

                <span className="nc-ff-label">Ingress:</span>
                <span className="nc-ff-val">Cloudflare Zero Trust</span>

                <span className="nc-ff-label">Overlay &amp; Mesh:</span>
                <span className="nc-ff-val">Hysteria 2 · WireGuard · sing-box</span>

                <span className="nc-ff-label">Workloads:</span>
                <span className="nc-ff-val">Docker Containers</span>

                <span className="nc-ff-label">Core Services:</span>
                <span className="nc-ff-val">NetCheck · Nextcloud Storage · MeTube · Stalwart Mail</span>

                <span className="nc-ff-label">Shell:</span>
                <span className="nc-ff-val">
                  fish{" "}
                  <button
                    type="button"
                    className={`nc-fish-btn ${fishWiggling ? "wiggling" : ""}`}
                    onClick={handleFishClick}
                    title={
                      fishIndex >= FISH_SPECIES.length - 1
                        ? (isVi ? "Cá đã thành sushi! Bấm để mlem :D" : "Fish turned into sushi! Click to nom nom :D")
                        : (isVi ? `Bấm để đổi cá! (${FISH_SPECIES[fishIndex].name})` : `Click to change fish! (${FISH_SPECIES[fishIndex].name})`)
                    }
                    aria-label="Interactive fish emoji"
                  >
                    {FISH_SPECIES[fishIndex].emoji}
                  </button>
                  {fishNotice && (
                    <span key={sushiEats} className="nc-sushi-notice">
                      {fishNotice}
                    </span>
                  )}
                </span>

                {isSudo && (
                  <>
                    <span className="nc-ff-label nc-ff-label-root">Privileges:</span>
                    <span className="nc-ff-val nc-ff-val-root">ALL=(ALL:ALL) NOPASSWD: ALL (NO PASSWORD NEEDED 🔓)</span>

                    <span className="nc-ff-label nc-ff-label-root">Kernel Defense:</span>
                    <span className="nc-ff-val nc-ff-val-root">SELinux disabled (living on the edge 💀)</span>

                    <span className="nc-ff-label nc-ff-label-root">Reactor Core Temp:</span>
                    <span className="nc-ff-val nc-ff-val-root">9001°C (CRITICAL CORE MELTDOWN IMMINENT 🚨 EVACUATE FACILITY 🔥)</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Card 3: Projects & Connect (NetCheck, Storage, MeTube, GitHub, Discord, Email) */}
        <section className={`nc-card ${isSudo ? "is-root-card" : ""}`}>
          <header className="nc-card-head">
            <h2 className="nc-card-title">
              <span className="nc-prompt-glyph">&gt;</span> projects_and_connect {isSudo ? "--root-access" : ""}
            </h2>
            {isSudo && (
              <span className="nc-card-status nc-status-root">[ALL PORTS UNRESTRICTED]</span>
            )}
          </header>
          <div className="nc-card-body">
            <div className="nc-services-grid">
              {/* 1. NetCheck */}
              <a
                href="https://netcheck.nnt25.io.vn/"
                target="_blank"
                rel="noopener noreferrer"
                className="nc-service-cell nc-service-cell-netcheck"
              >
                <div className="nc-service-top">
                  <div className="nc-service-icon">
                    <Icon name="netcheck" />
                  </div>
                  {isSudo ? (
                    <span className="nc-badge-running" style={{ color: "var(--danger)", borderColor: "rgba(255,107,107,0.45)", background: "rgba(255,107,107,0.14)" }}>
                      # ROOT DIRECT
                    </span>
                  ) : (
                    <span className="nc-badge-running nc-badge-netcheck">RUNNING</span>
                  )}
                </div>
                <div className="nc-service-name">
                  <span>NetCheck</span>
                  <span className="nc-arrow">↗</span>
                </div>
                <div className="nc-service-desc">
                  {isVi
                    ? "Bộ công cụ chẩn đoán mạng tự host all-in-one: DNS, ping, traceroute, MTR, WHOIS, port check, headers & SSL."
                    : "Self-hosted network diagnostic toolkit. IP, DNS, ping, traceroute, MTR, port check, reverse DNS, WHOIS, SSL — one page."}
                </div>
                <div className="nc-service-footer">
                  <span>netcheck.nnt25.io.vn</span>
                  <span style={{ color: "var(--accent)" }}>[open ↵]</span>
                </div>
              </a>

              {/* 2. NNT's Storage */}
              <a
                href="https://storage.nnt25.io.vn/apps/registration/"
                target="_blank"
                rel="noopener noreferrer"
                className="nc-service-cell"
              >
                <div className="nc-service-top">
                  <div className="nc-service-icon">
                    <Icon name="telecloud" />
                  </div>
                  {isSudo ? (
                    <span className="nc-badge-running" style={{ color: "var(--danger)", borderColor: "rgba(255,107,107,0.45)", background: "rgba(255,107,107,0.14)" }}>
                      # ROOT DIRECT
                    </span>
                  ) : (
                    <span className="nc-badge-running">RUNNING</span>
                  )}
                </div>
                <div className="nc-service-name">
                  <span>NNT's Storage</span>
                  <span className="nc-arrow">↗</span>
                </div>
                <div className="nc-service-desc">
                  {isVi
                    ? "Nơi an toàn cho mọi dữ liệu của bạn. Lưu trữ riêng tư chạy trên Nextcloud, đăng ký miễn phí nhận 10GB quota."
                    : "A safe home for all your data. Powered by Nextcloud with end-to-end encryption. Instant registration with 10GB free quota."}
                </div>
                <div className="nc-service-footer">
                  <span>storage.nnt25.io.vn</span>
                  <span style={{ color: "var(--accent)" }}>[register ↵]</span>
                </div>
              </a>

              {/* 3. MeTube */}
              <a
                href="https://metube.nnt25.io.vn/"
                target="_blank"
                rel="noopener noreferrer"
                className="nc-service-cell"
              >
                <div className="nc-service-top">
                  <div className="nc-service-icon">
                    <Icon name="metube" />
                  </div>
                  {isSudo ? (
                    <span className="nc-badge-running" style={{ color: "var(--danger)", borderColor: "rgba(255,107,107,0.45)", background: "rgba(255,107,107,0.14)" }}>
                      # ROOT DIRECT
                    </span>
                  ) : (
                    <span className="nc-badge-running">RUNNING</span>
                  )}
                </div>
                <div className="nc-service-name">
                  <span>MeTube</span>
                  <span className="nc-arrow">↗</span>
                </div>
                <div className="nc-service-desc">
                  {isVi
                    ? "Dán link video từ YouTube, TikTok, Facebook, Instagram và tải trực tiếp về thiết bị sạch sẽ không quảng cáo."
                    : "Self-hosted web GUI for youtube-dl / yt-dlp. Download videos cleanly from YouTube, TikTok, Facebook, Instagram."}
                </div>
                <div className="nc-service-footer">
                  <span>metube.nnt25.io.vn</span>
                  <span style={{ color: "var(--accent)" }}>[download ↵]</span>
                </div>
              </a>

              {/* 4. GitHub */}
              <a
                href="https://github.com/sudo-Penguin-Lalala"
                target="_blank"
                rel="noopener noreferrer"
                className="nc-service-cell"
              >
                <div className="nc-service-top">
                  <div className="nc-service-icon">
                    <Icon name="github" />
                  </div>
                  {isSudo ? (
                    <span className="nc-badge-running" style={{ color: "var(--danger)", borderColor: "rgba(255,107,107,0.45)", background: "rgba(255,107,107,0.14)" }}>
                      # ROOT REPO ACCESS
                    </span>
                  ) : (
                    <span className="nc-badge-running nc-badge-netcheck">FEATURED CODE</span>
                  )}
                </div>
                <div className="nc-service-name">
                  <span>GitHub</span>
                  <span className="nc-arrow">↗</span>
                </div>
                <div className="nc-service-desc">
                  {isVi
                    ? "Nơi lưu trữ các dự án mã nguồn mở: NetCheck, Jane-Clanker, hạ tầng tự host, và các thử nghiệm cuối tuần."
                    : "Home of open-source projects: NetCheck, Jane-Clanker, homelab infrastructure, and weekend tinkering repos."}
                </div>
                <div className="nc-service-footer">
                  <span>github.com/sudo-Penguin-Lalala</span>
                  <span style={{ color: "var(--accent)" }}>[browse repos ↗]</span>
                </div>
              </a>

              {/* 5. Discord */}
              <div className="nc-service-cell" style={{ cursor: "default" }}>
                <div className="nc-service-top">
                  <div className="nc-service-icon">
                    <Icon name="discord" />
                  </div>
                  {isSudo ? (
                    <span className="nc-badge-running" style={{ color: "var(--danger)", borderColor: "rgba(255,107,107,0.45)", background: "rgba(255,107,107,0.14)" }}>
                      # ROOT COMM LINK
                    </span>
                  ) : (
                    <span className="nc-badge-running" style={{ color: "#818cf8", borderColor: "rgba(88, 101, 242, 0.3)", background: "rgba(88, 101, 242, 0.12)" }}>
                      DIRECT DM
                    </span>
                  )}
                </div>
                <div className="nc-service-name">
                  <span>Discord</span>
                </div>
                <div className="nc-service-desc">
                  {isVi ? "Tên người dùng: " : "Username: "}
                  <strong style={{ color: "var(--accent)" }}>nnt2589</strong>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.76rem", color: "var(--text-dim)" }}>
                    {isVi ? "Thêm bạn hoặc gửi tin nhắn trực tiếp." : "Add me directly or send a direct message."}
                  </p>
                </div>
                <div className="nc-service-footer">
                  <button type="button" className="nc-btn" onClick={handleCopyDiscord}>
                    {copiedDiscord ? "✓ copied" : "copy username"}
                  </button>
                  <a
                    href="https://discord.com/users/873873496814538803"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nc-btn nc-btn-accent"
                  >
                    open dm ↗
                  </a>
                </div>
              </div>

              {/* 6. Email */}
              <div className="nc-service-cell" style={{ cursor: "default" }}>
                <div className="nc-service-top">
                  <div className="nc-service-icon">
                    <Icon name="nnt" />
                  </div>
                  {isSudo ? (
                    <span className="nc-badge-running" style={{ color: "var(--danger)", borderColor: "rgba(255,107,107,0.45)", background: "rgba(255,107,107,0.14)" }}>
                      # ROOT MAIL SERVER
                    </span>
                  ) : (
                    <span className="nc-badge-running" style={{ color: "var(--accent)", borderColor: "rgba(255, 180, 84, 0.3)", background: "rgba(255, 180, 84, 0.12)" }}>
                      INBOX
                    </span>
                  )}
                </div>
                <div className="nc-service-name">
                  <span>Email</span>
                </div>
                <div className="nc-service-desc">
                  <strong style={{ color: "#fff" }}>contact@nnt25.io.vn</strong>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.76rem", color: "var(--text-dim)" }}>
                    {isVi ? "Hộp thư liên hệ chính, phản hồi nhanh." : "Primary contact inbox, fast response."}
                  </p>
                </div>
                <div className="nc-service-footer">
                  <button type="button" className="nc-btn" onClick={handleCopyEmail}>
                    {copiedEmail ? "✓ copied" : "copy email"}
                  </button>
                  <a
                    href="mailto:contact@nnt25.io.vn"
                    className="nc-btn nc-btn-accent"
                  >
                    send ↵
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Terminal Footer */}
        <footer className="nc-footer">
          <div className="nc-footer-copy">
            <button
              type="button"
              className="nc-footer-logo-btn"
              onClick={handleSpinLogo}
              style={{ transform: `rotate(${spinDeg}deg)` }}
              title={isVi ? "Bấm để xoay logo chơi :D" : "Click to spin logo :D"}
              aria-label="Interactive logo easter egg"
            >
              <Icon name="nnt" />
            </button>
            <span>© 2026 Thien Nguyen</span>
            {isSpinBadgeVisible && (
              <span
                className={`nc-spin-badge ${isSpinBadgeLeaving ? "is-leaving" : ""}`}
              >
                <span>{getSpinAchievement(spinCount, isVi).icon}</span>
                <span style={{ opacity: 0.75 }}>[{spinCount}]</span>
                <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                  {getSpinAchievement(spinCount, isVi).badge}
                </span>
                <span>{getSpinAchievement(spinCount, isVi).title}</span>
              </span>
            )}
          </div>
          <div>
            <a
              href="https://github.com/sudo-Penguin-Lalala/website-react"
              target="_blank"
              rel="noopener noreferrer"
              className="nc-footer-repo-link"
            >
              <Icon name="github" />
              <span>[source: website-react ↗]</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomeV2;
