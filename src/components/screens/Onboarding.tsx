import { useAppStore } from "../../store/appStore";
import { Button } from "../common/Button";
import styles from "./Onboarding.module.css";

export function Onboarding() {
  const { setCompletedOnboarding, logEvent } = useAppStore();

  const handleStart = () => {
    setCompletedOnboarding(true);
    logEvent("start_app", "onboarding");
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <img src="/hero-sleep.jpg" alt="Sleep tracking" className={styles.heroImage} />
        <div className={styles.heroOverlay} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Smart Pillow</h1>
        <p className={styles.subtitle}>
          Your sleep, analyzed. Your health, protected.
        </p>

        <ul className={styles.features}>
          <li>🛏️ Sleep tracking with smart sensors</li>
          <li>🔒 Your data stays on your device</li>
          <li>💡 Daily tips to improve your sleep</li>
        </ul>

        <Button variant="primary" onClick={handleStart} className={styles.cta}>
          Get Started
        </Button>

        <p className={styles.disclaimer}>
          Not a medical device. For research only.
        </p>
      </div>
    </div>
  );
}
