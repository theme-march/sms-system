import { notFound } from "next/navigation";
import prisma from "@/src/lib/db/prisma";
import { normalizeWebsiteContent } from "@/src/lib/website-content";
import { PublicHeader } from "@/src/components/website/PublicHeader";
import { DownloadCenter } from "@/src/components/website/DownloadCenter";
import { websiteThemeStyle } from "@/src/lib/website-theme";
import "../school-home.css";
import "../../components/website/download-center.css";
import "../notices.css";

export const dynamic = "force-dynamic";
export default async function PublicContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let school: any = null;
  try {
    school = await prisma.school.findFirst({
      where: { deletedAt: null },
      include: { websiteSettings: true },
      orderBy: { createdAt: "asc" },
    });
  } catch {}
  const content = normalizeWebsiteContent(school?.websiteSettings?.content);
  const page = content.pages.find((item) => item.slug === slug);
  if (!page) notFound();
  const schoolName = school?.name || "আপনার বিদ্যালয়ের নাম";
  const selectedTeachers =
    slug === "our-teachers" && school?.id && content.publicTeacherIds.length
      ? await prisma.teacher.findMany({
          where: {
            schoolId: school.id,
            id: { in: content.publicTeacherIds },
            status: "ACTIVE",
          },
          include: { designation: true, department: true },
        })
      : [];
  return (
    <main className="school-site" style={websiteThemeStyle(content.theme)}>
      <div className="school-shell">
        <PublicHeader content={content} schoolName={schoolName} />
        <section className="inner-page">
          <div className="page-breadcrumb">
            <a href="/">হোম</a>
            <span>›</span>
            <b>{page.title}</b>
          </div>
          <article className="page-article">
            {page.image && <img src={page.image} alt={page.title} />}
            <h1>{page.title}</h1>
            <div className="title-rule" />
            <div className="page-copy">
              {page.content.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {!!page.sections?.length && (
              <div className="detail-sections">
                {page.sections.map((item, i) => (
                  <section
                    className={`detail-section ${item.image ? "has-image" : ""}`}
                    key={i}
                  >
                    {item.image && <img src={item.image} alt={item.heading} />}
                    <div>
                      <h2>{item.heading}</h2>
                      <span className="mini-rule" />
                      <p>{item.content}</p>
                    </div>
                  </section>
                ))}
              </div>
            )}
            {slug === "gallery" && content.gallery.length > 0 && (
              <div className="gallery-grid">
                {content.gallery.map((item, i) => (
                  <figure key={i}>
                    <img src={item.image} alt={item.title} />
                    <figcaption>{item.title}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            {(slug === "events" || slug === "notices") &&
              (content.notices.length ? (
                <ul className="page-notices all-notices-list">
                  {content.notices.map((n, i) => (
                    <li key={i}>
                      {n.href ? (
                        <a href={n.href}>{n.title}</a>
                      ) : (
                        <span>{n.title}</span>
                      )}
                      <time>{n.date}</time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="notice-empty">
                  বর্তমানে কোনো নোটিশ প্রকাশিত হয়নি।
                </p>
              ))}
            {slug === "our-teachers" && (
              <div className="public-teachers">
                {selectedTeachers.length ? (
                  selectedTeachers.map((t) => (
                    <article key={t.id}>
                      {t.profilePhoto ? (
                        <img src={t.profilePhoto} alt={t.nameBn || t.nameEn} />
                      ) : (
                        <span>{(t.nameBn || t.nameEn).slice(0, 1)}</span>
                      )}
                      <h3>{t.nameBn || t.nameEn}</h3>
                      <p>
                        {t.designation?.nameBn ||
                          t.designation?.nameEn ||
                          "শিক্ষক"}
                      </p>
                      {t.department && (
                        <small>
                          {t.department.nameBn || t.department.nameEn}
                        </small>
                      )}
                      {t.qualification && <small>{t.qualification}</small>}
                    </article>
                  ))
                ) : (
                  <p>প্রদর্শনের জন্য কোনো শিক্ষক নির্বাচন করা হয়নি।</p>
                )}
              </div>
            )}
            {slug === "downloads" && <DownloadCenter />}
            {slug === "admission-information" && (
              <a className="public-cta" href="/admission/apply">
                অনলাইনে ভর্তি আবেদন করুন
              </a>
            )}
            {slug === "contact" && (
              <div className="contact-details">
                <h2>বিদ্যালয় অফিস</h2>
                <p>{content.contactAddress || school?.address}</p>
                <p>
                  {content.contactPhone || school?.phone}
                  <br />
                  {content.contactEmail || school?.email}
                </p>
                <p>{content.contactText}</p>
              </div>
            )}
          </article>
        </section>
        <footer className="school-footer">
          <span>
            © {new Date().getFullYear()} {schoolName} — {content.footerText}
          </span>
          <a href="/login">Admin Login</a>
        </footer>
      </div>
    </main>
  );
}
