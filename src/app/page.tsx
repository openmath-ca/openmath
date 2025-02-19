"use client"
import styles from "./page.module.css";
import { useTheme } from "@/app/context/ThemeContext";

export default function HomePage() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ""}`}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Welcome to OpenMath</h1>
        <p className={styles.text}>Your open, flexible resource for learning math.</p>
        <div className={styles.buttonContainer}>
          <a href="/lessons" className={styles.button}>Explore Lessons</a>
          <a href="/about" className={styles.buttonSecondary}>About OpenMath</a>
        </div>
      </div>
    </div>
  );
}
