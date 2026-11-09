export const profileData = {
  name: 'Thien Nguyen',
  avatar: {
    alt: 'Thien Nguyen — profile photo'
  },
  footer: '© 2026 Thien Nguyen ✦ All Rights Reserved ✦'
};

/**
 * Obfuscated email retriever to prevent automated crawlers & regex bots
 * from scraping the raw email address from static source/bundles.
 */
export const getContactEmail = () => {
  if (typeof atob === "function") {
    try {
      return atob("Y29udGFjdEBubnQyNS5pby52bg==");
    } catch {
      /* fallback */
    }
  }
  return ["contact", "nnt25.io.vn"].join(String.fromCharCode(64));
};

