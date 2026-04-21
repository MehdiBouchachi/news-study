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
    <div className="sticky top-0 z-20 border-b border-(--border) bg-[rgba(246,249,252,0.86)] backdrop-blur-md">
      <div className="section-shell py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-medium tracking-wide text-(--text-faint) sm:text-xs">
              المرحلة الحالية
            </p>
            <p className="truncate text-sm font-semibold text-(--text-strong) sm:text-base">
              {stepLabels[step - 1]}
            </p>
          </div>

          <div className="shrink-0 rounded-full border border-(--blue-200) bg-white px-3 py-1 text-xs font-semibold text-(--blue-700) shadow-[var(--shadow-xs)] sm:text-sm">
            {step} / {total}
          </div>
        </div>

        <div className="mt-3">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Shell({ children, step, showProgress = true }) {
  return (
    <main className="min-h-screen bg-white" style={{ overflowAnchor: "none" }}>
      <TopBar />
      {showProgress && <ProgressHeader step={step} total={10} />}

      <div className="py-4 sm:py-7 lg:py-10">
        <div className="step-enter">{children}</div>
      </div>
    </main>
  );
}
