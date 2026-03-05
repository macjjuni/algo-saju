import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import GlassPanel from "@/components/ui/glass-panel";

export const metadata = {
  title: "이용약관",
};

export default function TermsPage() {
  const filePath = path.join(process.cwd(), "terms.md");
  const markdown = fs.readFileSync(filePath, "utf-8");
  const html = marked.parse(markdown) as string;

  return (
    <GlassPanel>
      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </GlassPanel>
  );
}
