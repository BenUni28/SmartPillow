import { Home, TrendingUp } from "lucide-react";
import styles from "./TabBar.module.css";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "home", label: "Sleep Report", icon: Home },
  { id: "trends", label: "Your Trends", icon: TrendingUp },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className={styles.tabBar} aria-label="Main navigation">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`${styles.tab} ${activeTab === id ? styles.active : ""}`}
          onClick={() => onTabChange(id)}
          aria-current={activeTab === id ? "page" : undefined}
          aria-label={label}
        >
          <Icon size={24} />
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </nav>
  );
}
