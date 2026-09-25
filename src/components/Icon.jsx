import discord from "../assets/icons/discord.svg";
import facebook from "../assets/icons/facebook.svg";
import github from "../assets/icons/github.svg";
import metube from "../assets/icons/metube.svg";
import netcheck from "../assets/icons/netcheck.svg";
import proton from "../assets/icons/proton.svg";
import steam from "../assets/icons/steam.svg";
import telecloud from "../assets/icons/telecloud.svg";

const icons = {
  discord,
  facebook,
  github,
  metube,
  netcheck,
  proton,
  steam,
  telecloud,
};

const Icon = ({ name, ...props }) => {
  const iconSrc = icons[name];

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found!`);
    return null;
  }

  return <img src={iconSrc} alt="" aria-hidden="true" {...props} />;
};

export default Icon;
