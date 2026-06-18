export const socialLinks = [
  {
    id: 'telecloud',
    label: 'Apply for TeleCloud',
    url: 'https://forms.gle/NTE74mGLUJRa6omK7',
    icon: 'generic-cloud',
    className: 'button-telecloud',
    title: 'Apply for TeleCloud access - Free unlimited cloud storage'
  },
  {
    id: 'netcheck',
    label: 'NetCheck',
    url: 'https://netcheck.nnt25.io.vn/',
    icon: 'netcheck',
    className: 'button-netcheck',
    title: 'Network diagnostic toolkit - DNS, ping, traceroute, MTR, and more'
  },
  {
    id: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/palera1nx/',
    icon: 'facebook',
    className: 'button-faceb',
    title: 'My Facebook profile'
  },
  {
    id: 'vesktop',
    label: 'Vesktop',
    url: 'https://vesktop.vencord.dev/',
    icon: 'vesktop',
    className: 'button-vesktop',
    title: "Vencord's custom client for Discord"
  },
  {
    id: 'metube',
    label: 'MeTube',
    url: 'https://metube.nnt25.io.vn/',
    icon: 'metube',
    className: 'button-metube',
    title: 'Self-hosted Youtube downloader'
  },
  {
    id: 'proton',
    label: 'Proton',
    url: 'https://proton.me/',
    icon: 'proton',
    className: 'button-proton',
    title: 'Privacy by default'
  },
  {
    id: 'telegram',
    label: 'Telegram',
    url: 'https://t.me/NNT2589',
    icon: 'telegram',
    className: 'button-telegram',
    title: 'Just DM me'
  },
  {
    id: 'discord',
    label: 'Discord',
    url: 'https://discord.com/users/873873496814538803',
    icon: 'discord',
    className: 'button-discord',
    title: 'Just DM me'
  },
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/sudo-Penguin-Lalala',
    icon: 'github',
    className: 'button-github',
    title: 'My code repos'
  },
  {
    id: 'steam',
    label: 'Steam',
    url: 'https://steamcommunity.com/id/NNT_25',
    icon: 'steam',
    className: 'button-steam-alt',
    title: 'Gaming stuff'
  },
  {
    id: 'email',
    label: 'Email',
    url: 'mailto:contact@nnt25.io.vn',
    icon: 'generic-email',
    className: 'button-default',
    title: 'Send me an email'
  },;

export const profileData = {
  name: 'Thien Nguyen',
  tagline: 'The most annoying person :D',
  avatar: {
    alt: 'Thien Nguyen — profile photo'
  },
  footer: '© 2026 Thien Nguyen ✦ All Rights Reserved ✦'
};

// Bento section structure — links + spans only.
// UI strings live in src/i18n/strings.js (per language).
export const sectionShapes = {
  about: [
    { span: '3x2', key: 'homelab', accent: true },
    { span: '3x1', key: 'location' },
    { span: '3x1', key: 'care' },
  ],
  homelab: [
    { span: '2x1', key: 'telecloud', href: 'https://forms.gle/NTE74mGLUJRa6omK7', accent: true },
    { span: '2x1', key: 'netcheck', href: 'https://netcheck.nnt25.io.vn/' },
    { span: '2x1', key: 'metube', href: 'https://metube.nnt25.io.vn/' },
  ],
  now: [
    { span: '2x1', key: 'playing', href: 'https://steamcommunity.com/id/NNT_25' },
    { span: '2x1', key: 'building', href: 'https://github.com/sudo-Penguin-Lalala' },
    { span: '2x1', key: 'talking', href: 'https://t.me/NNT2589' },
  ],
};
