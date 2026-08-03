export type CalendarEntryType = "MEETING" | "EVENT" | "HOLIDAY";

export type WebsiteContent = {
  tagline: string;
  bannerImage: string;
  banners: {
    title: string;
    subtitle: string;
    image: string;
    buttonText?: string;
    buttonHref?: string;
  }[];
  menu: {
    label: string;
    href: string;
    color: string;
    children?: { label: string; href: string }[];
  }[];
  pages: {
    slug: string;
    title: string;
    content: string;
    image?: string;
    sections?: { heading: string; content: string; image?: string }[];
    custom?: boolean;
  }[];
  notices: { title: string; date: string; href?: string; featured?: boolean }[];
  aboutTitle: string;
  aboutText: string;
  principalName: string;
  principalMessage: string;
  principalImage: string;
  academics: { title: string; text: string }[];
  gallery: { title: string; image: string }[];
  teachers: { name: string; designation: string; image: string }[];
  publicTeacherIds: string[];
  homeTeacherIds: string[];
  meetingDates: {
    date: string;
    label: string;
    type: CalendarEntryType;
  }[];
  calendarWeeklyOffDays: number[];
  emergencyContacts: { label: string; number: string }[];
  campaignLinks: { label: string; href: string }[];
  downloads: {
    title: string;
    category: "FORM" | "SYLLABUS" | "PUBLICATION" | "OTHER";
    fileUrl: string;
    classId?: string;
    sectionId?: string;
    publishedAt?: string;
  }[];
  admissionText: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactText: string;
  footerText: string;
  theme: {
    primary: string;
    secondary: string;
    background: string;
    border: string;
  };
};

export const defaultWebsiteContent: WebsiteContent = {
  tagline: "জ্ঞান, শৃঙ্খলা ও মানবিকতায় আগামীর পথচলা",
  bannerImage: "/school-hero-v2.png",
  banners: [
    {
      title: "আপনার বিদ্যালয়ের নাম",
      subtitle: "জ্ঞান, শৃঙ্খলা ও মানবিকতায় আগামীর পথচলা",
      image: "/school-hero-v2.png",
    },
    {
      title: "মানসম্মত আধুনিক শিক্ষা",
      subtitle: "মেধা, মনন ও সৃজনশীলতায় প্রতিটি শিক্ষার্থীর বিকাশ",
      image: "/school-hero-science.webp",
      buttonText: "আমাদের সম্পর্কে",
      buttonHref: "/about",
    },
  ],
  menu: [
    { label: "হোম", href: "/", color: "#ff8a00" },
    {
      label: "আমাদের সম্পর্কে",
      href: "/about",
      color: "#e91e63",
      children: [
        { label: "বিদ্যালয় পরিচিতি", href: "/about" },
        { label: "শিক্ষকমণ্ডলী", href: "/our-teachers" },
        { label: "সুযোগ-সুবিধা", href: "/facilities" },
        { label: "আমাদের অর্জন", href: "/achievements" },
      ],
    },
    {
      label: "একাডেমিক",
      href: "/academic-activities",
      color: "#8e24aa",
      children: [
        { label: "একাডেমিক কার্যক্রম", href: "/academic-activities" },
        { label: "প্রোগ্রাম ও ক্লাব", href: "/programs" },
        { label: "ডাউনলোডস", href: "/downloads" },
      ],
    },
    {
      label: "ভর্তি",
      href: "/admission-information",
      color: "#b45309",
      children: [
        { label: "ভর্তি তথ্য", href: "/admission-information" },
        { label: "অনলাইন আবেদন", href: "/admission/apply" },
        { label: "আবেদন ট্র্যাক করুন", href: "/admission/track" },
      ],
    },
    { label: "গ্যালারি", href: "/gallery", color: "#00838f" },
    { label: "ইভেন্টস", href: "/events", color: "#6a1b9a" },
    { label: "যোগাযোগ", href: "/contact", color: "#d84315" },
  ],
  pages: [
    {
      slug: "about",
      title: "আমাদের সম্পর্কে",
      content:
        "আমাদের বিদ্যালয় মানসম্মত শিক্ষা, নৈতিকতা ও সৃজনশীলতার সমন্বয়ে শিক্ষার্থীদের আলোকিত মানুষ হিসেবে গড়ে তুলতে কাজ করে।",
      sections: [
        {
          heading: "ইতিহাস ও ঐতিহ্য",
          content:
            "প্রতিষ্ঠালগ্ন থেকে বিদ্যালয়টি এলাকার শিক্ষাবিস্তারে গুরুত্বপূর্ণ ভূমিকা পালন করে আসছে।",
        },
        {
          heading: "লক্ষ্য ও উদ্দেশ্য",
          content:
            "জ্ঞান, দক্ষতা, মূল্যবোধ ও মানবিকতায় সমৃদ্ধ দায়িত্বশীল নাগরিক তৈরি করা।",
        },
        {
          heading: "পরিচালনা পর্ষদ",
          content:
            "অভিজ্ঞ শিক্ষাবিদ ও সমাজের প্রতিনিধিদের সমন্বয়ে বিদ্যালয়ের কার্যক্রম পরিচালিত হয়।",
        },
      ],
    },
    {
      slug: "academic-activities",
      title: "একাডেমিক কার্যক্রম",
      content:
        "যোগ্য ও অভিজ্ঞ শিক্ষকমণ্ডলীর তত্ত্বাবধানে জাতীয় শিক্ষাক্রম অনুসারে নিয়মিত পাঠদান, মূল্যায়ন ও বিশেষ সহায়তা কার্যক্রম পরিচালিত হয়।",
      sections: [
        {
          heading: "শিক্ষাক্রম",
          content: "জাতীয় শিক্ষাক্রম অনুসারে শ্রেণিভিত্তিক পরিকল্পিত পাঠদান।",
        },
        {
          heading: "মূল্যায়ন পদ্ধতি",
          content:
            "ধারাবাহিক মূল্যায়ন, শ্রেণি পরীক্ষা এবং সামষ্টিক পরীক্ষার সমন্বিত ব্যবস্থা।",
        },
        {
          heading: "ক্লাস রুটিন",
          content: "শিক্ষার্থীবান্ধব ও ভারসাম্যপূর্ণ দৈনিক পাঠসূচি।",
        },
      ],
    },
    {
      slug: "programs",
      title: "প্রোগ্রাম ও সহশিক্ষা কার্যক্রম",
      content:
        "বিজ্ঞান মেলা, বিতর্ক, খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান, স্কাউটিং ও বিভিন্ন ক্লাব কার্যক্রম নিয়মিত আয়োজন করা হয়।",
      sections: [
        {
          heading: "বিজ্ঞান ও আইসিটি ক্লাব",
          content:
            "উদ্ভাবন, প্রোগ্রামিং ও বিজ্ঞানভিত্তিক প্রকল্পে শিক্ষার্থীদের অংশগ্রহণ।",
        },
        {
          heading: "ক্রীড়া ও সংস্কৃতি",
          content: "বার্ষিক ক্রীড়া, সংগীত, আবৃত্তি ও সাংস্কৃতিক প্রতিযোগিতা।",
        },
        {
          heading: "স্কাউট ও সামাজিক কার্যক্রম",
          content: "নেতৃত্ব, শৃঙ্খলা ও সমাজসেবার বাস্তব অভিজ্ঞতা।",
        },
      ],
    },
    {
      slug: "gallery",
      title: "ফটো গ্যালারি",
      content: "বিদ্যালয়ের স্মরণীয় কার্যক্রম ও আয়োজনের নির্বাচিত ছবি।",
    },
    {
      slug: "notices",
      title: "সকল নোটিশ",
      content:
        "বিদ্যালয়ের সর্বশেষ ঘোষণা, পরীক্ষার সময়সূচি, ভর্তি তথ্য এবং গুরুত্বপূর্ণ সকল নোটিশ এখানে পাওয়া যাবে।",
    },
    {
      slug: "events",
      title: "ইভেন্টস ও নোটিশ",
      content:
        "বিদ্যালয়ের আসন্ন অনুষ্ঠান, পরীক্ষা এবং গুরুত্বপূর্ণ ঘোষণাসমূহ এখানে প্রকাশ করা হয়।",
    },
    {
      slug: "admission-information",
      title: "ভর্তি তথ্য",
      content:
        "নতুন শিক্ষাবর্ষে বিভিন্ন শ্রেণিতে ভর্তি কার্যক্রম, যোগ্যতা, প্রয়োজনীয় কাগজপত্র ও সময়সূচি এখানে পাওয়া যাবে।",
      sections: [
        {
          heading: "ভর্তির যোগ্যতা",
          content:
            "শ্রেণিভেদে বয়স, পূর্ববর্তী ফলাফল এবং আসনসংখ্যা অনুযায়ী ভর্তি নেওয়া হয়।",
        },
        {
          heading: "প্রয়োজনীয় কাগজপত্র",
          content:
            "জন্মনিবন্ধন, ছবি, পূর্ববর্তী বিদ্যালয়ের ছাড়পত্র ও ফলাফলের কপি।",
        },
        {
          heading: "আবেদন প্রক্রিয়া",
          content:
            "অনলাইনে আবেদন সম্পন্ন করে নির্ধারিত সময়ে প্রয়োজনীয় কাগজপত্র জমা দিতে হবে।",
        },
      ],
    },
    {
      slug: "our-teachers",
      title: "শিক্ষকমণ্ডলী",
      content:
        "যোগ্য, অভিজ্ঞ ও নিবেদিত শিক্ষকমণ্ডলী শিক্ষার্থীদের একাডেমিক ও নৈতিক বিকাশে কাজ করছেন।",
    },
    {
      slug: "facilities",
      title: "সুযোগ-সুবিধা",
      content:
        "নিরাপদ ও শিক্ষার্থীবান্ধব ক্যাম্পাসে আধুনিক শিক্ষার প্রয়োজনীয় সুযোগ-সুবিধা রয়েছে।",
      sections: [
        {
          heading: "বিজ্ঞানাগার ও কম্পিউটার ল্যাব",
          content:
            "ব্যবহারিক বিজ্ঞান শিক্ষা ও ডিজিটাল দক্ষতা অর্জনের আধুনিক ব্যবস্থা।",
        },
        {
          heading: "লাইব্রেরি",
          content: "পাঠ্যবই, রেফারেন্স ও সাহিত্যসমৃদ্ধ শান্ত পাঠপরিবেশ।",
        },
        {
          heading: "খেলার মাঠ ও নিরাপত্তা",
          content:
            "নিয়মিত খেলাধুলা, বিশুদ্ধ পানি, সিসিটিভি ও নিরাপদ ক্যাম্পাস।",
        },
      ],
    },
    {
      slug: "achievements",
      title: "আমাদের অর্জন",
      content:
        "একাডেমিক ফলাফল, ক্রীড়া, সংস্কৃতি ও বিভিন্ন প্রতিযোগিতায় বিদ্যালয়ের সাফল্য।",
      sections: [
        {
          heading: "একাডেমিক সাফল্য",
          content: "পাবলিক পরীক্ষা ও বৃত্তিতে ধারাবাহিক ভালো ফলাফল।",
        },
        {
          heading: "সহশিক্ষা অর্জন",
          content:
            "বিতর্ক, বিজ্ঞান মেলা, ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতায় পুরস্কার।",
        },
      ],
    },
    {
      slug: "downloads",
      title: "ডাউনলোডস",
      content:
        "ফরম, রুটিন, সিলেবাস ও বিদ্যালয়ের প্রয়োজনীয় প্রকাশনা এখান থেকে সংগ্রহ করুন।",
    },
    {
      slug: "contact",
      title: "যোগাযোগ",
      content:
        "বিদ্যালয় অফিসে রবি থেকে বৃহস্পতিবার সকাল ৯টা থেকে বিকেল ৪টার মধ্যে যোগাযোগ করুন।",
    },
  ],
  notices: [
    {
      title: "নতুন শিক্ষাবর্ষে ভর্তি কার্যক্রম চলছে",
      date: "০৩ আগস্ট ২০২৬",
      featured: true,
    },
    {
      title: "অভিভাবক সমাবেশ ও ফলাফল প্রকাশ সংক্রান্ত নোটিশ",
      date: "২৮ জুলাই ২০২৬",
      featured: true,
    },
    {
      title: "আগামী সপ্তাহের শ্রেণি কার্যক্রম ও পরীক্ষার সময়সূচি",
      date: "২৫ জুলাই ২০২৬",
      featured: true,
    },
  ],
  aboutTitle: "আমাদের বিদ্যালয় সম্পর্কে",
  aboutText:
    "সুশিক্ষা, নৈতিকতা ও আধুনিক জ্ঞানচর্চার মাধ্যমে শিক্ষার্থীদের আলোকিত মানুষ হিসেবে গড়ে তোলাই আমাদের লক্ষ্য। অভিজ্ঞ শিক্ষক, নিরাপদ পরিবেশ এবং সহশিক্ষা কার্যক্রমের সমন্বয়ে এখানে প্রতিটি শিক্ষার্থী বিকশিত হওয়ার সুযোগ পায়।",
  principalName: "প্রধান শিক্ষক",
  principalMessage:
    "প্রিয় শিক্ষার্থী ও অভিভাবকবৃন্দ, আমাদের বিদ্যালয়ের ওয়েবসাইটে আপনাদের স্বাগতম। আমরা প্রতিটি শিক্ষার্থীর মেধা, মনন ও মানবিকতার পূর্ণ বিকাশে প্রতিশ্রুতিবদ্ধ।",
  principalImage: "",
  academics: [
    {
      title: "প্রাথমিক শাখা",
      text: "শিশুবান্ধব পরিবেশে আনন্দময় ও ভিত্তিমূলক শিক্ষা।",
    },
    {
      title: "মাধ্যমিক শাখা",
      text: "বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষায় মানসম্মত পাঠদান।",
    },
    {
      title: "সহশিক্ষা কার্যক্রম",
      text: "ক্রীড়া, বিতর্ক, সংস্কৃতি ও বিজ্ঞানচর্চার নিয়মিত আয়োজন।",
    },
  ],
  gallery: [],
  teachers: [],
  publicTeacherIds: [],
  homeTeacherIds: [],
  meetingDates: [
    {
      date: "2026-08-03",
      label: "মাসিক শিক্ষক সভা",
      type: "MEETING",
    },
  ],
  calendarWeeklyOffDays: [5, 6],
  emergencyContacts: [
    { label: "সরকারি তথ্য ও সেবা", number: "৩৩৩" },
    { label: "জরুরি সেবা", number: "৯৯৯" },
    { label: "ফায়ার সার্ভিস হটলাইন", number: "১০২" },
  ],
  campaignLinks: [
    { label: "বাংলা অভিযান", href: "#" },
    { label: "ইংরেজি অভিযান", href: "#" },
  ],
  downloads: [],
  admissionText:
    "ভর্তি সংক্রান্ত বিস্তারিত জানতে বিদ্যালয় অফিসে যোগাযোগ করুন অথবা অনলাইনে আবেদন করুন।",
  contactAddress: "Dhanmondi, Dhaka 1209",
  contactPhone: "+880 2-55001234",
  contactEmail: "office@shaplamodel.edu.bd",
  contactText: "বিদ্যালয় অফিস • রবি–বৃহস্পতি, সকাল ৯টা–বিকেল ৪টা",
  footerText: "সর্বস্বত্ব সংরক্ষিত",
  theme: {
    primary: "#a12b1f",
    secondary: "#796d5a",
    background: "#f4f1e9",
    border: "#ded8cc",
  },
};

export function normalizeWebsiteContent(content: unknown): WebsiteContent {
  if (!content || typeof content !== "object") return defaultWebsiteContent;
  const savedContent = content as Partial<WebsiteContent>;
  const normalized = {
    ...defaultWebsiteContent,
    ...savedContent,
  };
  const savedTheme = savedContent.theme || defaultWebsiteContent.theme;
  const isHexColor = (value: unknown): value is string =>
    typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
  normalized.theme = {
    primary: isHexColor(savedTheme.primary)
      ? savedTheme.primary
      : defaultWebsiteContent.theme.primary,
    secondary: isHexColor(savedTheme.secondary)
      ? savedTheme.secondary
      : defaultWebsiteContent.theme.secondary,
    background: isHexColor(savedTheme.background)
      ? savedTheme.background
      : defaultWebsiteContent.theme.background,
    border: isHexColor(savedTheme.border)
      ? savedTheme.border
      : defaultWebsiteContent.theme.border,
  };
  if (normalized.bannerImage === "/school-reference.png")
    normalized.bannerImage = "/school-hero-v2.png";
  if (!Array.isArray(normalized.banners) || !normalized.banners.length)
    normalized.banners = [
      {
        title: "আপনার বিদ্যালয়ের নাম",
        subtitle: normalized.tagline,
        image: normalized.bannerImage,
      },
    ];
  if (
    normalized.banners.length > 1 &&
    normalized.banners[1].image === normalized.banners[0].image
  )
    normalized.banners[1] = {
      ...normalized.banners[1],
      image: "/school-hero-science.webp",
    };
  if (!Array.isArray(normalized.pages) || !normalized.pages.length)
    normalized.pages = defaultWebsiteContent.pages;
  if (!Array.isArray(normalized.downloads)) normalized.downloads = [];
  if (!Array.isArray(normalized.meetingDates)) normalized.meetingDates = [];
  normalized.meetingDates = normalized.meetingDates.map((item) => ({
    ...item,
    type: ["MEETING", "EVENT", "HOLIDAY"].includes(item.type)
      ? item.type
      : "MEETING",
  }));
  if (!Array.isArray(normalized.calendarWeeklyOffDays))
    normalized.calendarWeeklyOffDays =
      defaultWebsiteContent.calendarWeeklyOffDays;
  normalized.calendarWeeklyOffDays = normalized.calendarWeeklyOffDays.filter(
    (day) => Number.isInteger(day) && day >= 0 && day <= 6,
  );
  if (!Array.isArray(normalized.emergencyContacts))
    normalized.emergencyContacts = defaultWebsiteContent.emergencyContacts;
  if (!Array.isArray(normalized.campaignLinks))
    normalized.campaignLinks = defaultWebsiteContent.campaignLinks;
  if (!Array.isArray(normalized.notices)) normalized.notices = [];
  normalized.notices = normalized.notices.map((notice, index) => ({
    ...notice,
    featured:
      typeof notice.featured === "boolean" ? notice.featured : index < 5,
  }));
  if (!Array.isArray(savedContent.homeTeacherIds))
    normalized.homeTeacherIds = normalized.publicTeacherIds.slice(0, 4);
  const savedPages = normalized.pages;
  const builtInSlugs = new Set(
    defaultWebsiteContent.pages.map((page) => page.slug),
  );
  const builtInPages = defaultWebsiteContent.pages.map((defaultPage) => {
    const savedPage = savedPages.find((page) => page.slug === defaultPage.slug);
    return {
      ...defaultPage,
      ...savedPage,
      sections: savedPage?.sections || defaultPage.sections || [],
    };
  });
  const customPages = savedPages
    .filter((page) => page.custom || !builtInSlugs.has(page.slug))
    .map((page) => ({
      ...page,
      custom: true,
      sections: Array.isArray(page.sections) ? page.sections : [],
    }));
  normalized.pages = [...builtInPages, ...customPages];
  if (
    !normalized.menu.some(
      (item) => Array.isArray(item.children) && item.children.length,
    )
  )
    normalized.menu = defaultWebsiteContent.menu;
  const publicRouteFixes: Record<string, string> = {
    "/academics": "/academic-activities",
    "/teachers": "/our-teachers",
    "/admissions": "/admission-information",
  };
  normalized.menu = normalized.menu.map((item, index) => ({
    ...item,
    href:
      publicRouteFixes[item.href] ||
      (item.href.startsWith("#")
        ? defaultWebsiteContent.menu[index]?.href || "/"
        : item.href),
    children: item.children?.map((child) => ({
      ...child,
      href: publicRouteFixes[child.href] || child.href,
    })),
  }));
  return normalized;
}
