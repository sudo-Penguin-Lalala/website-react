import { useEffect, useRef } from "preact/hooks";
import { useI18n } from "../../i18n/useI18n";
import { profileData } from "../../config/links";
import { useTerminalShell } from "./hooks/useTerminalShell";

import MatrixCanvas from "./components/MatrixCanvas";
import BrandHeader from "./components/BrandHeader";
import SudoBanner from "./components/SudoBanner";
import IdentityCard from "./components/IdentityCard";
import FastfetchCard from "./components/FastfetchCard";
import ServicesGrid from "./components/ServicesGrid";
import TerminalFooter from "./components/TerminalFooter";

import "./styles/HomeV2.css";

const HomeV2 = ({
  navigate,
  theme = "nord",
  cycleTheme,
  currentTheme,
}) => {
  const { lang, t, toggle } = useI18n();
  const isVi = lang === "vi";

  const {
    isSudo,
    sudoHint,
    handleBrandClick,
    handleExitSudo,
    rootOutput,
    setRootOutput,
    isExecuting,
    executingCmd,
    pageEffect,
    isReverting,
    showMatrix,
    executeCommand,
  } = useTerminalShell(isVi, navigate);

  // Keep a stable ref to isSudo to avoid rebuilding keydown listener when isSudo toggles
  const isSudoRef = useRef(isSudo);
  useEffect(() => {
    isSudoRef.current = isSudo;
  }, [isSudo]);

  // Tactile Keyboard Shortcuts: 't' for theme, 'l' for lang, 'Esc' to exit root
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        document.activeElement?.isContentEditable
      ) {
        if (e.key === "Escape") {
          document.activeElement.blur();
        }
        return;
      }

      if (e.key === "t" || e.key === "T") {
        cycleTheme?.();
      } else if (e.key === "l" || e.key === "L") {
        toggle?.();
      } else if (e.key === "Escape") {
        if (isSudoRef.current) {
          handleExitSudo?.();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cycleTheme, toggle, handleExitSudo]);

  return (
    <div
      className={`nc-term ${pageEffect !== "none" ? `effect-${pageEffect}` : ""} ${
        isReverting ? "is-reverting" : ""
      }`}
      data-theme={theme}
    >
      {showMatrix && <MatrixCanvas active={pageEffect === "matrix"} />}

      <main id="main-content" className="nc-container">
        <BrandHeader
          isSudo={isSudo}
          handleBrandClick={handleBrandClick}
          sudoHint={sudoHint}
          toggle={toggle}
          flag={t.flag}
          isVi={isVi}
          languageToggleAria={t.languageToggleAria}
          cycleTheme={cycleTheme}
          currentTheme={currentTheme}
          navigate={navigate}
        />

        {isSudo && (
          <SudoBanner
            handleExitSudo={handleExitSudo}
            isExecuting={isExecuting}
            executingCmd={executingCmd}
            executeCommand={executeCommand}
            rootOutput={rootOutput}
            setRootOutput={setRootOutput}
            isVi={isVi}
          />
        )}

        <IdentityCard
          isSudo={isSudo}
          isVi={isVi}
          profileName={t.profile.name}
          altText={profileData.avatar?.alt}
        />

        <FastfetchCard isSudo={isSudo} isVi={isVi} />

        <ServicesGrid isSudo={isSudo} isVi={isVi} />

        <TerminalFooter isVi={isVi} />
      </main>
    </div>
  );
};

export default HomeV2;
