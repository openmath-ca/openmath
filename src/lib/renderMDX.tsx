

import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export async function renderMDX(source: string) {
  console.log("renderMDX.tsx is running!");

  try {
    const compiled = await evaluate(source, {
      ...runtime,
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
      useDynamicImport: true, // Important for Next.js
    });

    console.log("Compiled MDX Output:", compiled);

    return compiled;
  } catch (error) {
    console.error("MDX Compilation Error:", error);
    let rvalue = () => <p className="text-red-500">Error rendering lesson.</p>;
    rvalue.displayName = "rvalue";
    return rvalue;
  }
}
