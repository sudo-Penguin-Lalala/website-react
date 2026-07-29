export const dictionary = {
  en: {
    flag: "🇺🇸",
    languageToggleAria: "Current language: English. Switch to Vietnamese.",
    nav: { links: "Links", about: "About" },
    profile: {
      name: "Thien Nguyen",
      tagline: "Random internet nerd",
    },
    socialLinksLabel: "Social links",
    about: {
      eyebrow: "About",
      title: "Tinkering, gaming, and self‑hosting from Vietnam.",
      lede: "I run a small fleet of services for friends, play more games than I should, and break things on purpose so I learn how to fix them.",
      cells: {
        homelab: { kicker: "In one line", title: "Homelab as a hobby, not a job.", body: "Linux, containers, a network closet that keeps growing. Most of what I host is free for anyone I trust enough to share the URL." },
        location: { kicker: "Based in", title: "Vietnam · UTC+7", body: "Mostly online late at night." },
        care: { kicker: "Care about", title: "Privacy, ownership.", body: "Proton for mail. Self-hosted for everything else." },
      },
    },
    homelab: {
      eyebrow: "What I run",
      title: "A few of the services I host.",
      lede: "Most are open invitations — DM me on Telegram or Discord if you want access.",
      cells: {
        telecloud: { kicker: "Cloud", title: "TeleCloud", body: "Unlimited storage that piggybacks on Telegram. Free, no quota.", linkLabel: "Apply for access →" },
        netcheck: { kicker: "Network", title: "NetCheck", body: "DNS, ping, traceroute, MTR, port check, reverse DNS, WHOIS, headers, SSL, HTTP — all in one page.", linkLabel: "Open NetCheck →" },
        metube: { kicker: "Media", title: "MeTube", body: "Paste almost any video link — TikTok, Facebook, YouTube, Instagram — and download it. The name says YouTube, but it works with most sites.", linkLabel: "Open MeTube →" },
      },
    },
    now: {
      eyebrow: "Now",
      title: "Currently somewhere between a keyboard and a controller.",
      cells: {
        playing: { kicker: "Playing", title: "Whatever Steam said I should.", body: "Library updates faster than I finish things.", linkLabel: "My Steam profile →" },
        building: { kicker: "Building", title: "Small repos, big plans.", body: "Mostly weekend code. Some of it survives Monday.", linkLabel: "See on GitHub →" },
        talking: { kicker: "Talking", title: "Telegram, Discord, anywhere.", body: "I reply faster than email expects me to.", linkLabel: "DM me →" },
      },
      closer: "The shape of this page will change. The way to reach me, won't.",
    },
  },
  vi: {
    flag: "🇻🇳",
    languageToggleAria: "Ngôn ngữ hiện tại: tiếng Việt. Chuyển sang tiếng Anh.",
    nav: { links: "Liên kết", about: "Giới thiệu" },
    profile: {
      name: "Ngọc Thiện",
      tagline: "Một thằng nerd lạc trôi trên internet",
    },
    socialLinksLabel: "Liên kết mạng xã hội",
    about: {
      eyebrow: "Giới thiệu",
      title: "Nghịch máy, chơi game, và tự host mọi thứ từ Việt Nam.",
      lede: "Mình chạy vài dịch vụ nhỏ cho bạn bè, chơi game hơi nhiều hơn mức nên, và thích phá rồi tìm cách sửa lại.",
      cells: {
        homelab: { kicker: "Gói gọn", title: "Homelab là đam mê, không phải nghề.", body: "Linux, container, một góc mạng cứ phình ra. Phần lớn dịch vụ mình host đều free cho ai mình tin tưởng." },
        location: { kicker: "Đang ở", title: "Việt Nam · UTC+7", body: "Hay online khuya." },
        care: { kicker: "Quan tâm", title: "Quyền riêng tư, tự chủ.", body: "Proton cho email. Tự host cho phần còn lại." },
      },
    },
    homelab: {
      eyebrow: "Mình host gì",
      title: "Vài dịch vụ mình đang chạy.",
      lede: "Đa phần ai cũng dùng được — DM Telegram hoặc Discord nếu muốn thử.",
      cells: {
        telecloud: { kicker: "Lưu trữ", title: "TeleCloud", body: "Dung lượng không giới hạn, chạy trên nền Telegram. Free, không quota.", linkLabel: "Đăng ký dùng →" },
        netcheck: { kicker: "Mạng", title: "NetCheck", body: "DNS, ping, traceroute, MTR, port check, reverse DNS, WHOIS, headers, SSL, HTTP — gom hết vào một trang.", linkLabel: "Mở NetCheck →" },
        metube: { kicker: "Media", title: "MeTube", body: "Dán link video từ TikTok, Facebook, YouTube, Instagram — tải về luôn. Tên là MeTube nhưng hỗ trợ hầu hết các trang.", linkLabel: "Mở MeTube →" },
      },
    },
    now: {
      eyebrow: "Hiện tại",
      title: "Đang lơ lửng đâu đó giữa bàn phím và tay cầm.",
      cells: {
        playing: { kicker: "Đang chơi", title: "Steam bảo chơi gì thì chơi nấy.", body: "Library mua nhanh hơn tốc độ chơi.", linkLabel: "Steam của mình →" },
        building: { kicker: "Đang code", title: "Repo nhỏ, mộng lớn.", body: "Code cuối tuần là chính. Đôi khi sống sót tới thứ Hai.", linkLabel: "Xem trên GitHub →" },
        talking: { kicker: "Liên hệ", title: "Telegram, Discord, đâu cũng được.", body: "Mình rep nhanh hơn bạn nghĩ.", linkLabel: "Nhắn mình →" },
      },
      closer: "Trang này sẽ thay đổi. Cách liên hệ với mình thì không.",
    },
  },
};

export const supportedLanguages = ["en", "vi"];
