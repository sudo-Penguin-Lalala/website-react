import ErrorBoundary from "./components/ErrorBoundary";
import { I18nProvider } from "./i18n/I18nProvider";
import HomeV2 from "./pages/HomeV2";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <HomeV2 />
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
