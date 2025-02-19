
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ExploreLessons from "./ExploreLessons";


const lessonsDir = path.join(process.cwd(), "lessons");

/**
 * Recursively collects all files in a directory.
 * @param dir - The directory to search.
 * @param filesArray - The accumulator for file paths.
 * @returns An array of full file paths.
 */
function getAllFiles(dir: string, filesArray: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, filesArray);
    } else {
      filesArray.push(fullPath);
    }
  });
  return filesArray;
}

const getLessonData = () => {
  try {
    console.log("Reading lessons from:", lessonsDir);

    if (!fs.existsSync(lessonsDir)) {
      console.error("Lessons directory does not exist:", lessonsDir);
      return [];
    }

    // Recursively get all files under the lessons directory
    const allFiles = getAllFiles(lessonsDir);
    console.log("Found files:", allFiles);

    // Filter for MDX files
    const mdxFiles = allFiles.filter((file) => file.endsWith(".mdx"));
    
    // Map each MDX file to a lesson object
    return mdxFiles.map((filePath) => {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      // Generate an ID from the file's path relative to the lessonsDir (with forward slashes)
      const relativePath = path.relative(lessonsDir, filePath).replace(/\\/g, "/");
      const id = relativePath.replace(/\.mdx$/, "");
      return {
        id,
        title: data.title || id,
        prerequisites: data.prerequisites || [],
        ignore: data.ignore || false,
      };
    });
  } catch (error) {
    console.error("Error loading lesson data:", error);
    return [];
  }
};

export default function LessonsPage() {
  const lessons = getLessonData();
  console.log("Loaded lessons:", lessons);

  return <ExploreLessons lessons={lessons} />;
}
