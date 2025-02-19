import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const lessonsDir = path.join(process.cwd(), "src", "app", "lessons");

export async function getLessonData() {
  try {
    const files = await fs.readdir(lessonsDir);

    const lessons = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map(async (filename) => {
          const filePath = path.join(lessonsDir, filename);
          const fileContents = await fs.readFile(filePath, "utf8");
          const { data } = matter(fileContents);

          return {
            id: filename.replace(".mdx", ""),
            title: data.title || filename.replace(".mdx", ""),
            prerequisites: data.prerequisites || [],
          };
        })
    );

    return lessons;
  } catch (error) {
    console.error("Error loading lesson data:", error);
    return [];
  }
}
