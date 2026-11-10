import ErrorBoundary from "./components/ErrorBoundary";
import { I18nProvider } from "./i18n/I18nProvider";
import HomeV2 from "./pages/HomeV2";
import BlogList from "./features/blog/components/BlogList";
import BlogPost from "./features/blog/components/BlogPost";
import { useRouter } from "./hooks/useRouter";
import { useTheme } from "./features/home/hooks/useTheme";
import "./App.css";
import "./features/blog/styles/Blog.css";

function AppContent() {
  const { page, slug, navigate } = useRouter();
  const { theme, cycleTheme, currentTheme } = useTheme();

  if (page === "blog") {
    return <BlogList navigate={navigate} />;
  }

  if (page === "post") {
    return <BlogPost slug={slug} navigate={navigate} />;
  }

  return (
    <HomeV2
      navigate={navigate}
      theme={theme}
      cycleTheme={cycleTheme}
      currentTheme={currentTheme}
    />
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
