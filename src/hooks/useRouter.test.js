import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/preact";
import { parsePath, useRouter } from "./useRouter";

describe("useRouter - Path Parsing & History Navigation", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
    window.scrollTo = vi.fn();
  });

  it("parses clean URLs, trailing slashes, encoded slugs, queries, and hash routes", () => {
    expect(parsePath("/")).toEqual({ page: "home", slug: null, path: "/" });
    expect(parsePath("/blog/")).toEqual({ page: "blog", slug: null, path: "/blog" });
    expect(parsePath("/blog/netcheck-v2//")).toEqual({
      page: "post",
      slug: "netcheck-v2",
      path: "/blog/netcheck-v2",
    });
    expect(parsePath("/blog/netcheck%2Dv2?ref=home#sec")).toEqual({
      page: "post",
      slug: "netcheck-v2",
      path: "/blog/netcheck%2Dv2",
    });
    expect(parsePath("/", "#/blog/hash-post")).toEqual({
      page: "post",
      slug: "hash-post",
      path: "/blog/hash-post",
    });
  });

  it("clears hash route when navigating back to '/'", () => {
    window.history.replaceState(null, "", "/#/blog");
    const { result } = renderHook(() => useRouter());
    expect(result.current.page).toBe("blog");

    act(() => {
      result.current.navigate("/");
    });

    expect(result.current.page).toBe("home");
    expect(window.location.pathname).toBe("/");
    expect(window.location.hash).toBe("");
  });
});
