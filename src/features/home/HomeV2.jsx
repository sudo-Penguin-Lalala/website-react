import { useI18n } from "../../i18n/useI18n";
import { profileData } from "../../config/links";
import { useTerminalShell } from "./hooks/useTerminalShell";
import { useTheme } from "./hooks/useTheme";

import MatrixCanvas from "./components/MatrixCanvas";
import BrandHeader from "./components/BrandHeader";
import SudoBanner from "./components/SudoBanner";
import IdentityCard from "./components/IdentityCard";
import FastfetchCard from "./components/FastfetchCard";
import ServicesGrid from "./components/ServicesGrid";
import TerminalFooter from "./components/TerminalFooter";

import "./styles/HomeV2.css";

const HomeV2 = () => {
  const { lang, t, toggle } = useI18n();
  const isVi = lang === "vi";
  const { theme, cycleTheme, currentTheme } = useTheme();

  const {
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
  } = useTerminalShell(isVi);

  return (
    <div
      className={`nc-term ${pageEffect !== "none" ? `effect-${pageEffect}` : ""} ${
        isReverting ? "is-reverting" : ""
      }`}
      data-theme={theme}
    >
      {showMatrix && <MatrixCanvas active={pageEffect === "matrix"} />}

      <div className="nc-container">
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
        />

        {isSudo && (
          <SudoBanner
            handleExitSudo={handleExitSudo}
            handleRunCommand={handleRunCommand}
            cmdInput={cmdInput}
            setCmdInput={setCmdInput}
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
      </div>
    </div>
  );
};

export default HomeV2;
