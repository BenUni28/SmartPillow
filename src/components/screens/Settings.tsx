import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../common/Button";
import { useAppStore } from "../../store/appStore";
import styles from "./Settings.module.css";

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const { reset, logEvent, events } = useAppStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    logEvent("view_settings", "settings");
  }, [logEvent]);

  const handleReset = () => {
    reset();
    setShowDeleteConfirm(false);
    logEvent("reset_demo", "settings");
  };

  const handleExportLog = () => {
    const eventLog = events.map((e) => ({
      ...e,
      time: new Date(e.timestamp).toISOString(),
    }));
    const text = JSON.stringify(eventLog, null, 2);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pillow-log-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logEvent("export_log", "settings");
  };

  return (
    <div className={styles.modal}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2>Settings</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Notifications</h3>
            <div className={styles.setting}>
              <label className={styles.settingLabel}>Daily reminder</label>
              <input
                type="time"
                defaultValue="07:00"
                className={styles.timeInput}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Preferences</h3>
            <div className={styles.setting}>
              <label className={styles.settingLabel}>Temperature units</label>
              <select className={styles.select}>
                <option>Celsius (°C)</option>
                <option>Fahrenheit (°F)</option>
              </select>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Privacy</h3>
            <p className={styles.privacyText}>
              Your sleep data is stored only on your device. We never upload,
              store, or share your information.
            </p>
            <Button
              variant="secondary"
              onClick={handleExportLog}
              className={styles.actionBtn}
            >
              Export usability log
            </Button>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>About</h3>
            <p className={styles.aboutText}>
              Smart Pillow v1.0
              <br />
              <small>For research and validation only</small>
            </p>
            <p className={styles.disclaimer}>
              ⚠️ Not a medical device. This app is for research and educational
              purposes only.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Demo</h3>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(true)}
              className={styles.actionBtn}
            >
              Reset everything
            </Button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className={styles.confirmDialog}>
            <div className={styles.confirmContent}>
              <p className={styles.confirmText}>
                Reset all data and return to onboarding?
              </p>
              <div className={styles.confirmButtons}>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
