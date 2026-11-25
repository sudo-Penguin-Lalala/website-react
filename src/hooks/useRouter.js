import { useState, useEffect, useCallback } from "preact/hooks";

/**
 * Lightweight browser History API router with zero dependencies.
 * Fully compatible with Cloudflare Pages / Workers single-page-application mode.
 */
export function parsePath(pathname, hash = "") {
  let rawPath = pathname || "/";
  if (rawPath === "/" && hash.startsWith("#/")) {
    rawPath = hash.slice(1);
  }

  // Strip query string and fragment before route matching
  const pathOnly = rawPath.split("?")[0].split("#")[0] || "/";
  const cleanPath = pathOnly.length > 1 ? pathOnly.replace(/\/+$/, "") || "/" : pathOnly;

  if (cleanPath === "/blog") {
    return { page: "blog", slug: null, path: cleanPath };
  }

  if (cleanPath.startsWith("/blog/")) {
    const rawSlug = cleanPath.slice("/blog/".length).trim();
    if (rawSlug) {
      let slug = rawSlug;
      try {
        slug = decodeURIComponent(rawSlug);
      } catch (err) {
        console.warn("Malformed URI slug fallback:", rawSlug, err);
      }
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
      const nextRoute = parsePath(window.location.pathname, window.location.hash);
      setCurrentRoute((prev) =>
        prev.page === nextRoute.page &&
        prev.slug === nextRoute.slug &&
        prev.path === nextRoute.path
          ? prev
          : nextRoute
      );
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

    const currentFull = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (currentFull !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }

    setCurrentRoute(parsePath(targetPath, ""));
    if (typeof window.scrollTo === "function") {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  return {
    ...currentRoute,
    navigate,
  };
}
