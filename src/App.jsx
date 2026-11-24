import { lazy, Suspense } from "preact/compat";
import ErrorBoundary from "./components/ErrorBoundary";
import { I18nProvider } from "./i18n/I18nProvider";
import HomeV2 from "./pages/HomeV2";
import { useRouter } from "./hooks/useRouter";
import { useTheme } from "./features/home/hooks/useTheme";
import "./App.css";

const BlogList = lazy(() => import("./features/blog/components/BlogList"));
const BlogPost = lazy(() => import("./features/blog/components/BlogPost"));

function AppContent() {
  const { page, slug, navigate } = useRouter();
  const { theme, cycleTheme, currentTheme } = useTheme();

  return (
    <>
      <a href="#main-content" className="nc-skip-link">
        Skip to content
      </a>
      {page === "blog" && (
        <Suspense fallback={<div className="nc-loading-screen" aria-live="polite">Loading blog…</div>}>
          <BlogList navigate={navigate} />
        </Suspense>
      )}
      {page === "post" && (
        <Suspense fallback={<div className="nc-loading-screen" aria-live="polite">Loading post…</div>}>
          <BlogPost slug={slug} navigate={navigate} />
        </Suspense>
      )}
      {page !== "blog" && page !== "post" && (
        <HomeV2
          navigate={navigate}
          theme={theme}
          cycleTheme={cycleTheme}
          currentTheme={currentTheme}
        />
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
