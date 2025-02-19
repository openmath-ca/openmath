"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { renderMDX } from "@/lib/renderMDX";
import { loadLesson } from "@/lib/loadLesson";
import { MDXProvider } from "@mdx-js/react";
import { useTheme } from "@/app/context/ThemeContext";
import styles from "./lesson.module.css"; // ✅ Use the fixed CSS

export default function LessonPage() {
  const { isDarkMode } = useTheme();
  window.idm = useTheme().isDarkMode;
  window.bl ="#00d3d3"
  window.bd ="#0fffff"
  window.gl= "#7B68EE"
  window.gd = "#ab98fe"
  window.__defineGetter__("b", () => isDarkMode ? bd : bl);
  window.__defineGetter__("g", () => isDarkMode ? gd : gl);

  const params = useParams();
  window.link = {
    cursor: "pointer",
    "text-decoration": "underline",
};
  const [Content, setContent] = useState<null | (() => JSX.Element)>(null);

  useEffect(() => {
    async function fetchLesson() {
      if (!params.slug) return;
      const slugArray = Array.isArray(params.slug) ? params.slug : [params.slug];

      console.log("Fetching lesson:", slugArray);
      const lesson = await loadLesson(slugArray);

      if (!lesson || lesson.error) {
        console.error("Lesson not found or invalid:", lesson?.error);
        setContent(() => () => <p className={styles.error}>Lesson not found.</p>);
        return;
      }

      console.log("Lesson content received:", lesson);
      const compiled = await renderMDX(lesson.content);
      console.log("Compiled content received:", compiled);

      setContent(() => compiled.default);
    }

    fetchLesson();
  }, [params.slug]);

  return (
    <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ""}`}>
      <main className={styles.lessonContainer}>
        <MDXProvider>
          <article className={styles.contentWrapper}>
            {Content ? <Content /> : <></>}
          </article>
        </MDXProvider>
      </main>
    </div>
  );
}

LessonPage.displayName = "LessonPage";
