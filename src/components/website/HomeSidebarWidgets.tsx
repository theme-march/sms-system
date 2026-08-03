"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import type { WebsiteContent } from "@/src/lib/website-content";

const WEEKDAY_LABELS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];
const ENTRY_LABELS = {
  MEETING: "সভা",
  EVENT: "অনুষ্ঠান",
  HOLIDAY: "ছুটি",
} as const;

export function HomeSidebarWidgets({
  meetingDates,
  calendarWeeklyOffDays,
  emergencyContacts,
  campaignLinks,
  display = "all",
}: Pick<
  WebsiteContent,
  | "meetingDates"
  | "calendarWeeklyOffDays"
  | "emergencyContacts"
  | "campaignLinks"
> & {
  display?: "all" | "calendar" | "services";
}) {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const leadingDays = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const entriesByDate = new Map<string, WebsiteContent["meetingDates"]>();
  meetingDates.forEach((item) => {
    entriesByDate.set(item.date, [
      ...(entriesByDate.get(item.date) || []),
      item,
    ]);
  });
  const monthLabel = visibleMonth.toLocaleDateString("bn-BD", {
    month: "long",
    year: "numeric",
  });
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const visibleEntries = meetingDates
    .filter((item) => item.date.startsWith(monthPrefix))
    .sort((a, b) => a.date.localeCompare(b.date));
  const weeklyOffText = calendarWeeklyOffDays.length
    ? [...calendarWeeklyOffDays]
        .sort((a, b) => a - b)
        .map((day) => WEEKDAY_LABELS[day])
        .join(" ও ")
    : "নির্ধারিত নেই";
  const dateKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <>
      {display !== "services" && (
        <section className="utility-widget calendar-widget">
          <h2>ক্যালেন্ডার</h2>
          <div className="calendar-toolbar">
            <button
              type="button"
              onClick={() => setVisibleMonth(new Date(year, month - 1, 1))}
              aria-label="আগের মাস"
            >
              ←
            </button>
            <b>{monthLabel}</b>
            <button
              type="button"
              onClick={() => setVisibleMonth(new Date(year, month + 1, 1))}
              aria-label="পরের মাস"
            >
              →
            </button>
          </div>
          <div className="calendar-weekdays" aria-hidden="true">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-days">
            {Array.from({ length: leadingDays }).map((_, index) => (
              <span className="empty" key={`empty-${index}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
              (day) => {
                const key = dateKey(day);
                const entries = entriesByDate.get(key) || [];
                const dayOfWeek = new Date(year, month, day).getDay();
                const weeklyOff = calendarWeeklyOffDays.includes(dayOfWeek);
                const hasHoliday = entries.some(
                  (item) => item.type === "HOLIDAY",
                );
                const hasEvent = entries.some((item) => item.type === "EVENT");
                const hasMeeting = entries.some(
                  (item) => item.type === "MEETING",
                );
                const statusClass = hasHoliday
                  ? "holiday"
                  : hasEvent
                    ? "event"
                    : hasMeeting
                      ? "meeting"
                      : weeklyOff
                        ? "weekly-off"
                        : "open-day";
                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();
                const dayInformation = [
                  ...entries.map(
                    (item) => `${ENTRY_LABELS[item.type]}: ${item.label}`,
                  ),
                  ...(weeklyOff && !hasHoliday ? ["সাপ্তাহিক ছুটি"] : []),
                ];
                if (!dayInformation.length)
                  dayInformation.push("বিদ্যালয় খোলা");
                return (
                  <button
                    type="button"
                    key={day}
                    className={`${statusClass} ${isToday ? "today" : ""}`.trim()}
                    aria-label={`${day} ${monthLabel}: ${dayInformation.join(", ")}`}
                  >
                    {day}
                    <span className="calendar-tooltip" role="tooltip">
                      <b>
                        {day} {monthLabel}
                      </b>
                      {dayInformation.map((information, index) => (
                        <small key={`${information}-${index}`}>
                          {information}
                        </small>
                      ))}
                    </span>
                  </button>
                );
              },
            )}
          </div>
          <div className="calendar-summary">
            <p>
              <b>সাপ্তাহিক ছুটি</b>
              <span>{weeklyOffText}</span>
            </p>
          </div>
          <div className="calendar-meetings">
            {visibleEntries.map((item) => (
              <p key={`${item.date}-${item.label}-${item.type}`}>
                <b>{Number(item.date.slice(-2))}</b>
                <span>
                  <small
                    className={`calendar-entry-type ${item.type.toLowerCase()}`}
                  >
                    {ENTRY_LABELS[item.type]}
                  </small>
                  {item.label}
                </span>
              </p>
            ))}
            {!visibleEntries.length && (
              <p className="calendar-no-events">এই মাসে বিশেষ অনুষ্ঠান নেই</p>
            )}
          </div>
        </section>
      )}

      {display !== "calendar" && (
        <>
          <section className="utility-widget emergency-widget">
            <h2>জরুরি যোগাযোগ</h2>
            <div className="emergency-list">
              {emergencyContacts.map((item, index) => (
                <div key={`${item.number}-${index}`}>
                  <span>{item.label}</span>
                  <b>{item.number}</b>
                </div>
              ))}
            </div>
            <a className="utility-more" href="tel:333">
              সকল সেবা দেখুন <ChevronDown aria-hidden="true" />
            </a>
          </section>

          <section className="utility-widget campaign-widget">
            <h2>অভিযান</h2>
            <div className="campaign-list">
              {campaignLinks.map((item, index) => (
                <a href={item.href || "#"} key={`${item.label}-${index}`}>
                  <CheckCircle2 aria-hidden="true" />
                  {item.label}
                </a>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
