"use client"
import styles from "./page.module.css";
import { useTheme } from "@/app/context/ThemeContext";

export default function HomePage() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ""}`}>
          <iframe 
              src={`/lessons/about/openmath`}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Lesson"
        ></iframe>
    </div>
  );
}