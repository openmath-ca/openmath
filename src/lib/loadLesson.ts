"use server"

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function loadLesson(slugArray: string[]) {
  console.log(slugArray)
  const ending = slugArray[slugArray.length - 1].endsWith(".mdx") ? "" : ".mdx";
  console.log(ending);
    const filePath = path.join(process.cwd(), "lessons", ...slugArray) + ending;
    console.log("Attempting to read file:", filePath);
    if (!fs.existsSync(filePath)) {
        console.error(`Lesson file not found: ${filePath}`);
        return { error: "Lesson not found" };
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    
  const { content, data } = matter(fileContent);

  return { content, data };
}

