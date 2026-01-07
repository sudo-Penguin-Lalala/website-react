import React from "react";
import Icon from "../components/Icon";
import avatar from "../assets/avatar.png";
import avatar2x from "../assets/avatar@2x.png";
import Squares from "../Squares";
import CurvedLoop from "../CurvedLoop";
import DecryptedText from "../DecryptedText";

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <div className="background-squares">
          <Squares
            speed={0.5}
            squareSize={40}
            direction="diagonal"
            borderColor="#183456"
            hoverFillColor="#222"
          />
        </div>
        <main className="container">
          <div className="column">
            <img
              className="avatar avatar--rounded"
              src={avatar}
              srcSet={`${avatar2x} 2x`}
              alt="LittleLink"
            />
            <h1>
              <div style={{ marginTop: "4rem" }}>
                <DecryptedText
                  text="Thien Nguyen"
                  animateOn="view"
                  revealDirection="center"
                />
              </div>
            </h1>
            <p>The most annoying person :D</p>
            <div className="button-stack" role="navigation">
              <a
                className="button button-hackclub"
                href="https://flavortown.hackclub.com/"
                target="_blank"
                rel="noopener"
                title="Hack Club Flavourtown"
              >
                <Icon name="facebook" className="icon" />
                Hack Club Flavourtown
              </a>
              <a
                className="button button-hackclub"
                href="https://www.facebook.com/NNT2589/"
                target="_blank"
                rel="noopener"
                title="My Facebook profile"
              >
                <Icon name="facebook" className="icon" />
                Facebook
              </a>
              <a
                className="button button-vesktop"
                href="https://vesktop.vencord.dev/"
                target="_blank"
                rel="noopener"
                title="Vencord's custom client for Discord"
              >
                <Icon name="vesktop" className="icon" />
                Vesktop
              </a>
              <a
                className="button button-metube"
                href="https://metube.nnt25.net/"
                target="_blank"
                rel="noopener"
                title="Self-hosted Youtube downloader"
              >
                <Icon name="metube" className="icon" />
                MeTube
              </a>
              <a
                className="button button-proton"
                href="https://proton.me/"
                target="_blank"
                rel="noopener"
                title="Privacy by default"
              >
                <Icon name="proton" className="icon" />
                Proton
              </a>
              <a
                className="button button-telegram"
                href="https://t.me/NNT2589"
                target="_blank"
                rel="noopener"
                title="Just DM me"
              >
                <Icon name="telegram" className="icon" />
                Telegram
              </a>
              <a
                className="button button-discord"
                href="https://discord.com/users/873873496814538803"
                target="_blank"
                rel="noopener"
                title="Just DM me"
              >
                <Icon name="discord" className="icon" />
                Discord
              </a>
              <a
                className="button button-github"
                href="https://github.com/sudo-Penguin-Lalala"
                target="_blank"
                rel="noopener"
                title="My code repos"
              >
                <Icon name="github" className="icon" />
                GitHub
              </a>
              <a
                className="button button-steam-alt"
                href="https://steamcommunity.com/id/NNT_25"
                target="_blank"
                rel="noopener"
                title="Gaming stuff"
              >
                <Icon name="steam" className="icon" />
                Steam
              </a>
              <a
                className="button button-default"
                href="mailto:bravo@nnt25.net"
                title="Send me an email"
              >
                <Icon name="generic-email" className="icon" />
                Email
              </a>
              <a
                className="button button-default"
                href="tel:+84911094416"
                title="Give me a call"
              >
                <Icon name="generic-phone" className="icon" />
                Phone
              </a>
            </div>
            <footer>
              <CurvedLoop marqueeText="© 2026 Thien Nguyen ✦ All Rights Reserved ✦" />
            </footer>
          </div>
        </main>
      </div>
    );
  }
}
export default Home;
