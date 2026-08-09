import { BannerSlider } from "./BannerSlider";
import type { WebsiteContent } from "@/src/lib/website-content";

export function PublicHeader({
  content,
  schoolName,
}: {
  content: WebsiteContent;
  schoolName: string;
}) {
  const menu = content.menu.some((item) => item.href === "/results")
    ? content.menu
    : [
        ...content.menu,
        { label: "ফলাফল", href: "/results", color: "#2e7d32" },
      ];

  return (
    <>
      <BannerSlider banners={content.banners} fallbackTitle={schoolName} />
      <nav className="school-nav" aria-label="প্রধান মেনু">
        {menu.map((item, index) => (
          <div className="school-nav-item" key={`${item.label}-${index}`}>
            <a
              className="school-nav-link"
              href={item.href}
              style={{ color: item.color }}
            >
              {item.label}
              {item.children?.length ? (
                <span className="nav-caret">⌄</span>
              ) : null}
            </a>
            {item.children?.length ? (
              <div className="school-submenu">
                {item.children.map((child, childIndex) => (
                  <a key={childIndex} href={child.href}>
                    {child.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </>
  );
}
