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
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <GlassPanel>
        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </GlassPanel>
    </div>
  );
}
