import { Settings } from "lucide-react";
import styles from "./Header.module.css";

interface HeaderProps {
  title: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  syncStatus?: string;
}

export function Header({
  title,
  showSettings = false,
  onSettingsClick,
  syncStatus,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>{title}</h1>
        {syncStatus && (
          <p className={styles.syncStatus}>
            {syncStatus}
          </p>
        )}
      </div>
      {showSettings && (
        <button
          className={styles.settingsBtn}
          onClick={onSettingsClick}
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
      )}
    </header>
  );
}
