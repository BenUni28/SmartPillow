import { useEffect, useState } from "react";
import { Header } from "../layout/Header";
import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";
import { useAppStore } from "../../store/appStore";
import styles from "./Home.module.css";
import { AlertCircle, TrendingDown, Moon, Zap } from "lucide-react";

export function Home() {
  const {
    nights,
    recordHomeViewTime,
    logEvent,
  } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const today = nights[nights.length - 1];
  const yesterday = nights.length > 1 ? nights[nights.length - 2] : null;

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
    recordHomeViewTime();
    logEvent("view_home", "home");
  }, [logEvent, recordHomeViewTime]);

  const scoreTrend = yesterday && today.score > yesterday.score ? "up" : "down";
  const insights = [
    { id: "sleep-duration", icon: Moon, label: `${today.sleepDuration.toFixed(1)}h sleep`, detail: "Target: 7-9 hours" },
    { id: "alignment", icon: Zap, label: "Neck alignment", detail: `${Math.max(...today.neckAlignment.map(a => a.alignment))}% max` },
    { id: "trend", icon: TrendingDown, label: "Trend", detail: scoreTrend === "up" ? "+3 pts vs yesterday" : "-2 pts vs yesterday" },
  ];

  return (
    <div className={styles.container}>
      <Header title="Your Sleep Report" showSettings={false} syncStatus="Last night" />

      <div className={styles.content}>
        <div className={styles.heroSection}>
          <img src="/morning.jpg" alt="Good morning" className={styles.heroImage} />
          <div className={styles.heroOverlay} />
          <div className={styles.heroText}>
            <p className={styles.heroGreeting}>Good morning! ☀️</p>
          </div>
        </div>

        {loading ? (
          <>
            <Skeleton width="100%" height={140} borderRadius="var(--radius-lg)" />
            <Skeleton width="100%" height={80} borderRadius="var(--radius-lg)" />
          </>
        ) : (
          <>
            <div className={styles.centerContent}>
              <Card className={styles.scoreCard}>
                <div className={styles.scoreCircle}>
                  <span className={styles.score}>{today.score}</span>
                  <span className={styles.scoreLabel}>Score</span>
                </div>
              </Card>

              <div className={styles.reasonBox}>
                <p className={styles.reasonText}>{today.mainReason}</p>
              </div>

              <Card className={`${styles.riskCard} ${styles[`risk-${today.riskLevel}`]}`}>
                <div className={styles.riskContent}>
                  <AlertCircle size={20} />
                  <div className={styles.riskText}>
                    <p className={styles.riskLabel}>
                      {today.riskLevel === "high"
                        ? "High neck strain"
                        : today.riskLevel === "medium"
                          ? "Moderate alignment"
                          : "Good alignment"}
                    </p>
                  </div>
                </div>
              </Card>

              <div className={styles.insightsGrid}>
                {insights.map(({ id, icon: Icon, label, detail }) => (
                  <Card
                    key={id}
                    className={`${styles.insightCard} ${expandedInsight === id ? styles.expanded : ""}`}
                    onClick={() => {
                      setExpandedInsight(expandedInsight === id ? null : id);
                      logEvent(`click_insight_${id}`, "home");
                    }}
                  >
                    <Icon size={24} className={styles.insightIcon} />
                    <p className={styles.insightLabel}>{label}</p>
                    {expandedInsight === id && (
                      <p className={styles.insightDetail}>{detail}</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        <p className={styles.privacy}>
          Your data is private and stays on your device.
        </p>
      </div>
    </div>
  );
}
