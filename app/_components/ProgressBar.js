const stepLabels = [
  "الموافقة",
  "البيانات",
  "التعليمات",
  "القراءة والتقييم",
  "الكشف",
  "إعادة التقييم",
  "الثقة في المصدر",
  "الاستدلال الآلي",
  "ما بعد التجربة",
  "الانتهاء",
];

export function TopBar() {
  return <div className="top-bar w-full" />;
}

export function ProgressHeader({ step, total }) {
  const pct = Math.round(((step - 1) / (total - 1)) * 100);

  return (
    <div className="sticky top-0 z-20 border-b border-(--border) bg-[rgba(244,248,252,0.88)] backdrop-blur-md">
      <div className="section-shell py-3 sm:py-3.5">
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-(--text-muted) sm:text-sm">
            {stepLabels[step - 1]}
          </span>
          <span className="rounded-full border border-(--blue-200) bg-white px-3 py-1 text-xs font-semibold text-(--blue-700) sm:text-sm">
            {step} / {total}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

export function Shell({ children, step, showProgress = true }) {
  return (
    <main className="min-h-screen" style={{ overflowAnchor: "none" }}>
      <TopBar />
      {showProgress && <ProgressHeader step={step} total={10} />}
      <div className="section-shell py-5 sm:py-8 lg:py-10">
        <div className="card-surface step-enter overflow-hidden">
          {children}
        </div>
      </div>
    </main>
  );
}
