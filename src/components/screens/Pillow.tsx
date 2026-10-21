import { useEffect, useState } from "react";
import { Battery, Bluetooth, RefreshCw } from "lucide-react";
import { Header } from "../layout/Header";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Skeleton } from "../common/Skeleton";
import { useAppStore } from "../../store/appStore";
import styles from "./Pillow.module.css";

export function Pillow() {
  const { demoState, lastSyncTime, setSyncLoading, setDemoState, logEvent } =
    useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
    logEvent("view_pillow", "pillow");
  }, [logEvent]);

  const handleSync = () => {
    setSyncLoading(true);
    setTimeout(() => {
      setSyncLoading(false);
      logEvent("sync_pillow", "pillow");
    }, 2000);
  };

  const handleReconnect = () => {
    setDemoState({ connected: true });
    logEvent("reconnect_pillow", "pillow");
  };

  return (
    <div className={styles.container}>
      <Header title="Your Pillow" showSettings={false} />

      <div className={styles.content}>
        {loading ? (
          <>
            <Skeleton width="100%" height={150} borderRadius="var(--radius-lg)" />
            <Skeleton width="100%" height={100} borderRadius="var(--radius-lg)" />
          </>
        ) : (
          <>
            <Card className={styles.productCard}>
              <div className={styles.productImage}>
                <span>🛏️</span>
                <p>Smart Pillow</p>
              </div>
            </Card>

            <Card>
              <p className={styles.cardTitle}>Status</p>
              <div className={styles.statusRow}>
                <div className={styles.statusLabel}>
                  <Bluetooth size={20} />
                  <span>Connection</span>
                </div>
                <span
                  className={`${styles.statusValue} ${demoState.connected ? styles.connected : styles.disconnected}`}
                >
                  {demoState.connected ? "Connected" : "Disconnected"}
                </span>
              </div>

              <div className={styles.statusRow}>
                <div className={styles.statusLabel}>
                  <Battery size={20} />
                  <span>Battery</span>
                </div>
                <span
                  className={`${styles.statusValue} ${demoState.lowBattery ? styles.low : styles.good}`}
                >
                  {demoState.lowBattery ? "Low (15%)" : "Good (87%)"}
                </span>
              </div>

              <div className={styles.statusRow}>
                <div className={styles.statusLabel}>
                  <RefreshCw size={20} />
                  <span>Last synced</span>
                </div>
                <span className={styles.statusValue}>{lastSyncTime}</span>
              </div>
            </Card>

            {demoState.connected ? (
              <Button
                variant="primary"
                onClick={handleSync}
              >
                Sync now
              </Button>
            ) : (
              <Button variant="primary" onClick={handleReconnect}>
                Reconnect my pillow
              </Button>
            )}

            {demoState.lowBattery && (
              <Card className={styles.warningCard}>
                <p className={styles.warningText}>
                  ⚠️ Battery is low. Consider charging your pillow.
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
