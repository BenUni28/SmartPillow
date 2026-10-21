import styles from "./PhoneFrame.module.css";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className={styles.container}>
      <div className={styles.phone}>
        <div className={styles.notch}></div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
