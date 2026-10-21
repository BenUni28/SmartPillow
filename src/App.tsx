import { useAppStore } from "./store/appStore";
import { PhoneFrame } from "./components/layout/PhoneFrame";
import { TabBar } from "./components/layout/TabBar";
import { Onboarding } from "./components/screens/Onboarding";
import { Home } from "./components/screens/Home";
import { Trends } from "./components/screens/Trends";
import styles from "./App.module.css";

function App() {
  const { completedOnboarding, currentScreen, setCurrentScreen } = useAppStore();

  const renderScreen = () => {
    if (!completedOnboarding) {
      return <Onboarding />;
    }

    switch (currentScreen) {
      case "home":
        return <Home />;
      case "trends":
        return <Trends />;
      default:
        return <Home />;
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab !== currentScreen) {
      setCurrentScreen(tab);
    }
  };

  if (!completedOnboarding) {
    return (
      <PhoneFrame>
        <div className={styles.screen}>{renderScreen()}</div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className={styles.container}>
        <div className={styles.screen}>
          {renderScreen()}
        </div>
        <TabBar activeTab={currentScreen} onTabChange={handleTabChange} />
      </div>
    </PhoneFrame>
  );
}

export default App;
