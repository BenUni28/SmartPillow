import { useEffect, useState } from "react";
import { Header } from "../layout/Header";
import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";
import { useAppStore } from "../../store/appStore";
import styles from "./NightDetails.module.css";

export function NightDetails() {
  const { nights, logEvent } = useAppStore();
  const [loading, setLoading] = useState(true);

  const today = nights[nights.length - 1];

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
    logEvent("view_night_details", "night");
  }, [logEvent]);

  const positionEmojis: Record<string, string> = {
    back: "🔙",
    left: "⬅️",
    right: "➡️",
    stomach: "📖",
  };

  return (
    <div className={styles.container}>
      <Header title="Night Details" showSettings={false} />

      <div className={styles.content}>
        {loading ? (
          <>
            <Skeleton width="100%" height={200} borderRadius="var(--radius-lg)" />
            <Skeleton width="100%" height={100} borderRadius="var(--radius-lg)" />
          </>
        ) : (
          <>
            <Card>
              <p className={styles.cardTitle}>Sleep Positions</p>
              <div className={styles.timeline}>
                {today.positions.map((pos, idx) => {
                  const minutes = pos.duration;
                  const width = (minutes / 60) * 100;
                  return (
                    <div
                      key={idx}
                      className={styles.timelineBlock}
                      style={{ width: `${width}%` }}
                      title={`${pos.type}: ${pos.duration} min`}
                    >
                      <span className={styles.positionLabel}>
                        {positionEmojis[pos.type]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span>🔙 Back</span>
                </div>
                <div className={styles.legendItem}>
                  <span>⬅️ Left</span>
                </div>
                <div className={styles.legendItem}>
                  <span>➡️ Right</span>
                </div>
                <div className={styles.legendItem}>
                  <span>📖 Stomach</span>
                </div>
              </div>
            </Card>

            <Card>
              <p className={styles.cardTitle}>Neck Alignment</p>
              <div className={styles.alignmentBars}>
                {today.neckAlignment.slice(0, 8).map((point, idx) => (
                  <div key={idx} className={styles.alignmentBar}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${point.alignment}%` }}
                    ></div>
                    <span className={styles.barLabel}>{point.hour}:00</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <p className={styles.cardTitle}>Sleep Stats</p>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Position changes</span>
                  <span className={styles.statValue}>
                    {today.positionChangeCount}
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Sleep duration</span>
                  <span className={styles.statValue}>
                    {today.sleepDuration.toFixed(1)}h
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Best alignment</span>
                  <span className={styles.statValue}>
                    {Math.max(...today.neckAlignment.map((a) => a.alignment))}%
                  </span>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
