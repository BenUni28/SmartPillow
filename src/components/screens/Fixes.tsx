import { useEffect, useState } from "react";
import { Header } from "../layout/Header";
import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";
import { useAppStore } from "../../store/appStore";
import styles from "./Fixes.module.css";

export function Fixes() {
  const {
    nights,
    updateFixCompleted,
    setFixReminderTime,
    logEvent,
  } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [undoToast, setUndoToast] = useState<string | null>(null);

  const today = nights[nights.length - 1];

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
    logEvent("view_fixes", "fixes");
  }, [logEvent]);

  const handleToggleFix = (fixId: string) => {
    const fix = today.fixes.find((f) => f.id === fixId);
    if (fix) {
      updateFixCompleted(today.date, fixId, !fix.completed);
      if (!fix.completed) {
        setUndoToast(fixId);
        setTimeout(() => setUndoToast(null), 5000);
      }
    }
  };

  const handleSetReminder = (fixId: string, time: string) => {
    setFixReminderTime(today.date, fixId, time);
  };

  const fixIcons: Record<string, string> = {
    pillow: "🛏️",
    stretch: "🧘",
    posture: "💪",
    temp: "❄️",
    movement: "🚶",
  };

  return (
    <div className={styles.container}>
      <Header title="Tonight's 2 Fixes" showSettings={false} />

      <div className={styles.content}>
        {loading ? (
          <>
            <Skeleton width="100%" height={200} borderRadius="var(--radius-lg)" />
            <Skeleton width="100%" height={200} borderRadius="var(--radius-lg)" />
          </>
        ) : (
          today.fixes.map((fix) => (
            <Card key={fix.id} className={styles.fixCard}>
              <div className={styles.fixHeader}>
                <div className={styles.fixTitleSection}>
                  <span className={styles.fixIcon}>
                    {fixIcons[fix.icon] || "✨"}
                  </span>
                  <div>
                    <p className={styles.fixTitle}>{fix.title}</p>
                    <p className={styles.fixReason}>{fix.reason}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={fix.completed}
                  onChange={() => handleToggleFix(fix.id)}
                  aria-label={`Mark "${fix.title}" as done`}
                />
              </div>

              {!fix.completed && (
                <div className={styles.reminderSection}>
                  <label className={styles.reminderLabel}>
                    Remind me:
                  </label>
                  <select
                    className={styles.reminderSelect}
                    value={fix.reminderTime || ""}
                    onChange={(e) => handleSetReminder(fix.id, e.target.value)}
                  >
                    <option value="">No reminder</option>
                    <option value="07:00">7:00 AM</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                  </select>
                </div>
              )}
            </Card>
          ))
        )}

        {undoToast && (
          <div className={styles.toast}>
            <p>Great! Keep it up.</p>
            <button
              className={styles.undoBtn}
              onClick={() => {
                handleToggleFix(undoToast);
                setUndoToast(null);
              }}
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
