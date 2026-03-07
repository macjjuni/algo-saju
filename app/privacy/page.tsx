import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import GlassPanel from "@/components/ui/glass-panel";

export const metadata = {
  title: "개인정보 처리방침",
};

export default function PrivacyPage() {
  const filePath = path.join(process.cwd(), "privacy.md");
  const markdown = fs.readFileSync(filePath, "utf-8");
  const html = marked.parse(markdown) as string;

  return (
    <GlassPanel>
      <article
        className="prose prose-invert prose-sm max-w-none prose-headings:mt-6 prose-headings:mb-2 prose-p:my-1.5 prose-li:my-0.5 prose-table:my-2"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </GlassPanel>
  );
}
