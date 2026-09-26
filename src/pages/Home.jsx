import { Fragment, useState } from "react";
import ClickSpark from "../components/ClickSpark";
import LanguageToggle from "../components/LanguageToggle";
import NavTabs from "../components/NavTabs";
import AmbientBackground from "../components/AmbientBackground";
import ProfileHeader from "../components/ProfileHeader";
import LinksPanel from "../components/LinksPanel";
import AboutPanel from "../components/AboutPanel";
import Footer from "../components/Footer";
import { detectDeviceTier } from "../lib/deviceTier";

const Home = () => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const [activeTab, setActiveTab] = useState("links");
  const tier = detectDeviceTier();

  const Wrapper = tier === "low" ? Fragment : ClickSpark;

  return (
    <Wrapper>
      <LanguageToggle />
      <div className="home">
        <AmbientBackground />
        <main className="container">
          <div className={`column${activeTab === "about" ? " column--wide" : ""}`}>
            <ProfileHeader
              imageLoaded={imageLoaded}
              onImageLoaded={() => setImageLoaded(true)}
            />

            <NavTabs active={activeTab} onChange={setActiveTab} />

            <LinksPanel
              key={`links-${activeTab}`}
              active={activeTab === "links"}
            />

            <AboutPanel
              key={`about-${activeTab}`}
              active={activeTab === "about"}
            />
          </div>
        </main>

        <Footer />
      </div>
    </Wrapper>
  );
};

export default Home;
