import { motion, useReducedMotion } from "motion/react";
import ShinyText from "./ShinyText";
import { useI18n } from "../i18n/useI18n";
import { profileData } from "../config/links";
import avatar224 from "../assets/avatar-224.png";
import avatar448 from "../assets/avatar-448.png";
import avatar224Webp from "../assets/avatar-224.webp";
import avatar448Webp from "../assets/avatar-448.webp";

/**
 * ProfileHeader renders the user's avatar with WebP/PNG responsive srcset,
 * animated name with ShinyText accent, and bio tagline.
 */
const ProfileHeader = ({ imageLoaded, onImageLoaded }) => {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  return (
    <>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{
          opacity: imageLoaded ? 1 : 0,
          scale: imageLoaded ? 1 : 0.92,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="avatar-wrap"
      >
        <picture>
          <source
            type="image/webp"
            srcSet={`${avatar224Webp} 1x, ${avatar448Webp} 2x`}
          />
          <img
            className="avatar avatar--rounded"
            src={avatar224}
            srcSet={`${avatar448} 2x`}
            width="128"
            height="128"
            alt={profileData.avatar.alt}
            fetchpriority="high"
            decoding="async"
            onLoad={onImageLoaded}
            onError={onImageLoaded}
          />
        </picture>
      </motion.div>

      <motion.h1
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <ShinyText text={t.profile.name} />
        <span style={{ color: "#2457f5" }}>.</span>
      </motion.h1>

      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {t.profile.tagline}
      </motion.p>
    </>
  );
};

export default ProfileHeader;
