import { ArrowUpLeft, BookOpen, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { poses, type Pose, type PoseCategory } from "@/data/poses";

type Filter = "all" | PoseCategory;

const categoryLabels: Record<PoseCategory, string> = {
  full: "جسد كامل",
  half: "نصف جسد",
};

const filterLabels: Record<Filter, string> = {
  all: "كل الوضعيات",
  full: "جسد كامل",
  half: "نصف جسد",
};

const number = (value: number) => new Intl.NumberFormat("ar-EG").format(value);

function PoseCard({ pose, index, onOpen }: { pose: Pose; index: number; onOpen: (pose: Pose) => void }) {
  const color = index % 6;

  return (
    <button
      className="pose-card"
      type="button"
      onClick={() => onOpen(pose)}
      aria-label={`عرض صورة: ${pose.title}، ${categoryLabels[pose.category]}`}
    >
      <span className={`pose-art pose-art--${pose.category} tone-${color}`}>
        <span className="pose-index" aria-hidden="true">{number(index + 1).padStart(2, "٠")}</span>
        <span className="pose-crosshair" aria-hidden="true">＋</span>
        <img src={pose.image} alt={pose.title} loading="lazy" />
        <span className="pose-open" aria-hidden="true"><ArrowUpLeft size={18} strokeWidth={1.7} /></span>
      </span>
      <span className="pose-caption">
        <span className="pose-caption-copy">
          <span className="pose-category">{categoryLabels[pose.category]}</span>
          <span className="pose-title">{pose.title}</span>
        </span>
        <span className="pose-card-arrow" aria-hidden="true"><ArrowUpLeft size={17} strokeWidth={1.7} /></span>
      </span>
    </button>
  );
}

function PoseViewer({ pose, onClose }: { pose: Pose; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="viewer-backdrop" onMouseDown={onClose}>
      <section
        className="viewer-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`عرض وضعية ${pose.title}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="viewer-close" type="button" onClick={onClose} aria-label="إغلاق العرض">
          <X size={20} />
        </button>
        <div className={`viewer-art tone-${poses.findIndex((item) => item.id === pose.id) % 6}`}>
          <img src={pose.image} alt={pose.title} />
        </div>
        <div className="viewer-caption">
          <span className="pose-category">{categoryLabels[pose.category]}</span>
          <h2>{pose.title}</h2>
          <p>من مكتبة أوضاع الشخصيات</p>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null);

  const filteredPoses = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ar");
    return poses.filter((pose) => {
      const matchesFilter = filter === "all" || pose.category === filter;
      const matchesQuery = !normalizedQuery || pose.title.toLocaleLowerCase("ar").includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const fullPoses = filteredPoses.filter((pose) => pose.category === "full");
  const halfPoses = filteredPoses.filter((pose) => pose.category === "half");
  const visibleSections: { id: PoseCategory; items: Pose[] }[] = [];
  if (filter !== "half" && fullPoses.length > 0) visibleSections.push({ id: "full", items: fullPoses });
  if (filter !== "full" && halfPoses.length > 0) visibleSections.push({ id: "half", items: halfPoses });

  const categoryCounts: Record<Filter, number> = {
    all: poses.length,
    full: poses.filter((pose) => pose.category === "full").length,
    half: poses.filter((pose) => pose.category === "half").length,
  };

  return (
    <main className="page-shell" dir="rtl">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="العودة إلى بداية مكتبة أوضاع الشخصيات">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span className="brand-copy">
            <strong>مكتبة الشخصيات</strong>
            <span>أرشيف الوضعيات</span>
          </span>
        </a>
        <nav className="header-nav" aria-label="التنقل في المكتبة">
          <a href="#library">المكتبة</a>
          <span className="nav-divider" aria-hidden="true" />
          <span className="header-note"><BookOpen size={15} strokeWidth={1.7} /> مجموعة مرئية</span>
        </nav>
        <a className="header-count" href="#library"><span className="header-count-dot" />{number(poses.length)} وضعية</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-mark" /> مرجع بصري للحركة والتعبير <span className="eyebrow-rule" /></p>
          <h1>مكتبة أوضاع<br /><span>الشخصيات</span></h1>
          <p className="hero-description">من وقفة كاملة إلى إيماءة صغيرة؛ اعثر على الوضعية التي تمنح شخصيتك تعبيرها المناسب.</p>
          <div className="hero-actions">
            <a className="hero-link" href="#library">استكشف المكتبة <ArrowUpLeft size={17} /></a>
            <span className="hero-small-note">صور مختارة، مرتبة بعناية</span>
          </div>
        </div>
        <div className="hero-side" aria-label={`${number(poses.length)} وضعية في تصنيفين`}>
          <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
          <span className="hero-collection">دليل الحركة <b>— ٠١</b></span>
          <div className="hero-stat"><strong>{number(poses.length)}</strong><span>وضعية<br />للشخصية</span></div>
          <div className="hero-side-bottom">
            <span>جسد كامل</span><i /> <span>نصف جسد</span>
          </div>
          <span className="hero-aside-serial" aria-hidden="true">POSE ARCHIVE / MMXXV</span>
        </div>
        <span className="hero-corner" aria-hidden="true">م</span>
      </section>

      <section className="library" id="library" aria-labelledby="library-title">
        <div className="library-intro">
          <div>
            <p className="eyebrow library-eyebrow"><span className="eyebrow-mark" /> فهرس الوضعيات <span className="eyebrow-rule" /></p>
            <h2 id="library-title">اختر اللقطة المناسبة</h2>
            <p className="library-subtitle">تصفّح حسب نوع اللقطة، أو ابحث عن الحركة التي تحتاجها.</p>
          </div>
          <span className="library-serial">المجموعة <b>٠١</b><br /><span>٤٩ بطاقة مصوّرة</span></span>
        </div>

        <div className="library-tools">
          <div className="filter-list" role="group" aria-label="تصفية حسب نوع اللقطة">
            {(["all", "full", "half"] as Filter[]).map((item) => (
              <button
                className={`filter-chip${filter === item ? " is-active" : ""}`}
                type="button"
                key={item}
                onClick={() => setFilter(item)}
                aria-pressed={filter === item}
              >
                {filterLabels[item]} <span>{number(categoryCounts[item])}</span>
              </button>
            ))}
          </div>
          <label className="search-box">
            <Search size={18} strokeWidth={1.8} aria-hidden="true" />
            <span className="sr-only">ابحث عن وضعية</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث عن وضعية…"
              dir="rtl"
            />
            {query && <button type="button" className="clear-search" onClick={() => setQuery("")} aria-label="مسح البحث"><X size={15} /></button>}
          </label>
        </div>

        {visibleSections.length > 0 ? visibleSections.map(({ id, items }) => (
          <section className="pose-section" key={id} aria-labelledby={`section-${id}`}>
            <div className="section-heading">
              <div className="section-heading-title">
                <span className={`section-marker section-marker--${id}`} aria-hidden="true" />
                <h3 id={`section-${id}`}>{categoryLabels[id]}</h3>
                <span className="section-count">{number(items.length)} وضعية</span>
              </div>
              <span className="section-note">{id === "full" ? "حركة كاملة من الرأس حتى القدم" : "إيماءات وتعبيرات عن قرب"}</span>
            </div>
            <div className="pose-grid">
              {items.map((pose) => <PoseCard key={pose.id} pose={pose} index={poses.findIndex((item) => item.id === pose.id)} onOpen={setSelectedPose} />)}
            </div>
          </section>
        )) : (
          <div className="empty-state">
            <span className="empty-mark" aria-hidden="true">⌕</span>
            <h3>لم نعثر على وضعية بهذا الاسم</h3>
            <p>جرّب كلمة أخرى، مثل «تصفيق» أو «تفكير».</p>
            <button type="button" onClick={() => { setQuery(""); setFilter("all"); }}>عرض كل الوضعيات</button>
          </div>
        )}
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span> مكتبة أوضاع الشخصيات</a>
        <span>كل وضعية تحكي شيئًا.</span>
        <span className="footer-edition">الأرشيف البصري <b>٠١</b></span>
      </footer>

      {selectedPose && <PoseViewer pose={selectedPose} onClose={() => setSelectedPose(null)} />}
    </main>
  );
}
