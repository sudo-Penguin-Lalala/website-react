import { useState, useEffect, useCallback } from "preact/hooks";

/**
 * Lightweight browser History API router with zero dependencies.
 * Fully compatible with Cloudflare Pages / Workers single-page-application mode.
 */
function parsePath(pathname, hash = "") {
  // Support both clean URLs (/blog/slug) and hash fallback (#/blog/slug)
  let cleanPath = pathname || "/";
  if (cleanPath === "/" && hash.startsWith("#/")) {
    cleanPath = hash.slice(1);
  }

  // Remove trailing slashes (except root '/')
  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }

  if (cleanPath === "/blog") {
    return { page: "blog", slug: null, path: cleanPath };
  }

  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.slice("/blog/".length).trim();
    if (slug) {
      return { page: "post", slug, path: cleanPath };
    }
    return { page: "blog", slug: null, path: "/blog" };
  }

  return { page: "home", slug: null, path: "/" };
}

export function useRouter() {
  const [currentRoute, setCurrentRoute] = useState(() =>
    parsePath(window.location.pathname, window.location.hash)
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(parsePath(window.location.pathname, window.location.hash));
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const navigate = useCallback((targetPath) => {
    if (!targetPath) return;

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }

    setCurrentRoute(parsePath(targetPath, ""));
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return {
    ...currentRoute,
    navigate,
  };
}
