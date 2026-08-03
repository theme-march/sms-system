import Link from "next/link";
import prisma from "@/src/lib/db/prisma";
import {
  defaultWebsiteContent,
  normalizeWebsiteContent,
} from "@/src/lib/website-content";
import "./school-home.css";
import { PublicHeader } from "@/src/components/website/PublicHeader";
import { HomeSidebarWidgets } from "@/src/components/website/HomeSidebarWidgets";
import { websiteThemeStyle } from "@/src/lib/website-theme";

export const dynamic = "force-dynamic";

export default async function SchoolHomePage() {
  let school: any = null;
  try {
    school = await prisma.school.findFirst({
      where: { deletedAt: null },
      include: { websiteSettings: true },
      orderBy: { createdAt: "asc" },
    });
  } catch {}
  const content = normalizeWebsiteContent(
    school?.websiteSettings?.content || defaultWebsiteContent,
  );
  const schoolName = school?.name || "আপনার বিদ্যালয়ের নাম";
  const selectedTeachers =
    school?.id && content.homeTeacherIds.length
      ? await prisma.teacher.findMany({
          where: {
            schoolId: school.id,
            id: { in: content.homeTeacherIds },
            status: "ACTIVE",
          },
          include: { designation: true },
          orderBy: { joiningDate: "asc" },
        })
      : [];
  return (
    <main
      className="school-site"
      id="home"
      style={websiteThemeStyle(content.theme)}
    >
      <div className="school-shell">
        <PublicHeader content={content} schoolName={schoolName} />
        <section className="home-grid">
          <div className="main-column">
            <section className="notice-box" id="notices">
              <div className="section-heading">
                <h2>নোটিশ বোর্ড</h2>
                <Link href="/notices">সব দেখুন</Link>
              </div>
              <ul>
                {content.notices
                  .filter((notice) => notice.featured)
                  .slice(0, 5)
                  .map((notice, i) => (
                    <li key={i}>
                      {notice.href ? (
                        <a href={notice.href}>{notice.title}</a>
                      ) : (
                        <span>{notice.title}</span>
                      )}
                      <time>{notice.date}</time>
                    </li>
                  ))}
              </ul>
            </section>
            <section className="classic-section" id="about">
              <h2>{content.aboutTitle}</h2>
              <p>{content.aboutText}</p>
            </section>
            <section className="classic-section" id="academics">
              <h2>একাডেমিক কার্যক্রম</h2>
              <div className="academic-grid">
                {content.academics.map((item, i) => (
                  <article key={i}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="classic-section" id="gallery">
              <h2>ফটো গ্যালারি</h2>
              {content.gallery.length ? (
                <div className="gallery-grid">
                  {content.gallery.map((item, i) => (
                    <figure key={i}>
                      <img src={item.image} alt={item.title} />
                      <figcaption>{item.title}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <p className="empty-copy">গ্যালারির ছবি শীঘ্রই যুক্ত হবে।</p>
              )}
            </section>
          </div>
          <aside
            className="side-column"
            aria-label="হোমপেজ সাইডবার"
            tabIndex={0}
          >
            <section className="side-card">
              <h2>প্রধান শিক্ষকের বাণী</h2>
              <div className="side-card-body principal-card-body">
                {content.principalImage && (
                  <img
                    className="principal-photo"
                    src={content.principalImage}
                    alt={content.principalName}
                  />
                )}
                <h3>{content.principalName || school?.principalName}</h3>
                <p>{content.principalMessage}</p>
              </div>
            </section>
            <HomeSidebarWidgets
              meetingDates={content.meetingDates}
              calendarWeeklyOffDays={content.calendarWeeklyOffDays}
              emergencyContacts={content.emergencyContacts}
              campaignLinks={content.campaignLinks}
              display="calendar"
            />
            <section className="side-card">
              <h2>শিক্ষকমণ্ডলী</h2>
              <div className="teacher-list">
                {selectedTeachers.length ? (
                  selectedTeachers.slice(0, 4).map((teacher) => (
                    <div className="teacher-row" key={teacher.id}>
                      {teacher.profilePhoto ? (
                        <img
                          src={teacher.profilePhoto}
                          alt={teacher.nameBn || teacher.nameEn}
                        />
                      ) : (
                        <span>
                          {(teacher.nameBn || teacher.nameEn).slice(0, 1)}
                        </span>
                      )}
                      <div>
                        <b>{teacher.nameBn || teacher.nameEn}</b>
                        <small>
                          {teacher.designation?.nameBn ||
                            teacher.designation?.nameEn ||
                            "শিক্ষক"}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-copy">
                    Teacher profiles will appear here.
                  </p>
                )}
              </div>
            </section>
            <section className="side-card" id="programs">
              <h2>ভর্তি তথ্য</h2>
              <div className="side-card-body admission-card-body">
                <p>{content.admissionText}</p>
                <Link className="apply-link" href="/admission/apply">
                  অনলাইনে আবেদন
                </Link>
              </div>
            </section>
            <HomeSidebarWidgets
              meetingDates={content.meetingDates}
              calendarWeeklyOffDays={content.calendarWeeklyOffDays}
              emergencyContacts={content.emergencyContacts}
              campaignLinks={content.campaignLinks}
              display="services"
            />
            <section className="side-card" id="contact">
              <h2>যোগাযোগ</h2>
              <div className="side-card-body contact-card-body">
                <p>{content.contactAddress || school?.address}</p>
                <p>
                  {content.contactPhone || school?.phone}
                  <br />
                  {content.contactEmail || school?.email}
                </p>
                <small>{content.contactText}</small>
              </div>
            </section>
          </aside>
        </section>
        <footer className="school-footer">
          <span>
            © {new Date().getFullYear()} {schoolName} — {content.footerText}
          </span>
          <Link href="/login">Admin Login</Link>
        </footer>
      </div>
    </main>
  );
}
