import { ChevronDown } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import styles from "./DemoPanel.module.css";

interface DemoPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DemoPanel({ isOpen, onToggle }: DemoPanelProps) {
  const { demoState, setDemoState, events, logEvent } = useAppStore();

  const handleToggle = (key: keyof typeof demoState) => {
    setDemoState({
      [key]: !demoState[key],
    });
    logEvent(`toggle_demo_${key}`, "demo");
  };

  const handleCopyLog = () => {
    const eventLog = events.map((e) => ({
      ...e,
      time: new Date(e.timestamp).toISOString(),
    }));
    const text = JSON.stringify(eventLog, null, 2);
    navigator.clipboard.writeText(text);
    logEvent("copy_log", "demo");
  };

  const handleClearLog = () => {
    localStorage.removeItem("smartpillow-events");
    logEvent("clear_log", "demo");
    window.location.reload();
  };

  return (
    <div className={`${styles.panel} ${isOpen ? styles.open : ""}`}>
      <button className={styles.toggle} onClick={onToggle}>
        <span>🎮 Demo</span>
        <ChevronDown size={20} />
      </button>

      {isOpen && (
        <div className={styles.content}>
          <div className={styles.section}>
            <p className={styles.label}>Connection States</p>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={demoState.connected}
                onChange={() => handleToggle("connected")}
              />
              <span>Connected</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={demoState.lowBattery}
                onChange={() => handleToggle("lowBattery")}
              />
              <span>Low Battery</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={demoState.firstNight}
                onChange={() => handleToggle("firstNight")}
              />
              <span>First Night</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={demoState.noData}
                onChange={() => handleToggle("noData")}
              />
              <span>No Data</span>
            </label>
          </div>

          <div className={styles.section}>
            <p className={styles.label}>Logging ({events.length} events)</p>
            <button className={styles.actionBtn} onClick={handleCopyLog}>
              📋 Copy log
            </button>
            <button className={styles.actionBtn} onClick={handleClearLog}>
              🗑️ Clear log
            </button>
          </div>

          <div className={styles.logPreview}>
            <p className={styles.logTitle}>Recent events:</p>
            <ul className={styles.logList}>
              {events.slice(-5).map((e, idx) => (
                <li key={idx}>
                  <small>
                    {new Date(e.timestamp).toLocaleTimeString()}: {e.event}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
