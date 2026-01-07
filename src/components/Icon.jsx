import React from "react";
import discord from "../assets/icons/discord.svg";
import email from "../assets/icons/email.svg";
import facebook from "../assets/icons/facebook.svg";
import genericCloud from "../assets/icons/generic-cloud.svg";
import genericCode from "../assets/icons/generic-code.svg";
import genericEmail from "../assets/icons/generic-email.svg";
import genericPhone from "../assets/icons/generic-phone.svg";
import genericReview from "../assets/icons/generic-review.svg";
import genericSms from "../assets/icons/generic-sms.svg";
import genericWebsite from "../assets/icons/generic-website.svg";
import github from "../assets/icons/github.svg";
import messenger from "../assets/icons/messenger.svg";
import steam from "../assets/icons/steam.svg";
import telegram from "../assets/icons/telegram.svg";
import vesktop from "../assets/icons/vesktop.png";
import metube from "../assets/icons/metube.svg";
import proton from "../assets/icons/proton.svg";
import hackclub from "../assets/icons/hackclub.svg";
const icons = {
  discord: discord,
  email: email,
  facebook: facebook,
  "generic-cloud": genericCloud,
  "generic-code": genericCode,
  "generic-email": genericEmail,
  "generic-phone": genericPhone,
  "generic-review": genericReview,
  "generic-sms": genericSms,
  "generic-website": genericWebsite,
  github: github,
  messenger: messenger,
  steam: steam,
  telegram: telegram,
  vesktop: vesktop,
  metube: metube,
  proton: proton,
  hackclub: hackclub,
};

const Icon = ({ name, ...props }) => {
  const iconSrc = icons[name];

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found!`);
    return null;
  }

  return <img src={iconSrc} alt={`${name} icon`} {...props} />;
};

export default Icon;
