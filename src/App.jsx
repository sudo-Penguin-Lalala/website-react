import ErrorBoundary from "./components/ErrorBoundary";
import { I18nProvider } from "./i18n/I18nProvider";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <Home />
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
