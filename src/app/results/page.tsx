import prisma from "@/src/lib/db/prisma";
import {
  defaultWebsiteContent,
  normalizeWebsiteContent,
} from "@/src/lib/website-content";
import { websiteThemeStyle } from "@/src/lib/website-theme";
import { PublicHeader } from "@/src/components/website/PublicHeader";
import { PublicResultLookup } from "./PublicResultLookup";
import "../school-home.css";
import "./results.css";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const school = await prisma.school.findFirst({
    where: { deletedAt: null },
    include: { websiteSettings: true },
    orderBy: { createdAt: "asc" },
  });
  const content = normalizeWebsiteContent(
    school?.websiteSettings?.content || defaultWebsiteContent,
  );
  const schoolName = school?.name || "আপনার বিদ্যালয়ের নাম";

  return (
    <main className="school-site" style={websiteThemeStyle(content.theme)}>
      <div className="school-shell">
        <PublicHeader content={content} schoolName={schoolName} />
        <section className="result-content">
          <div className="main-column">
            <PublicResultLookup schoolName={schoolName} />
          </div>
        </section>
        <footer className="school-footer result-footer">
          <span>
            {content.footerText || `© ${new Date().getFullYear()} ${schoolName}`}
          </span>
          <a href="/">হোমে ফিরুন</a>
        </footer>
      </div>
    </main>
  );
}
