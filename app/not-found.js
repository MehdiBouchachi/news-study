import Link from "next/link";
import { FiArrowRight, FiCompass, FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6"
      style={{
        background:
          "radial-gradient(1300px 620px at 50% -12%, var(--blue-200), transparent 68%), linear-gradient(180deg, var(--bg-accent), var(--bg))",
      }}
    >
      <div
        className="pointer-events-none absolute top-[-90px] left-1/2 h-[220px] w-[220px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "rgba(106, 166, 222, 0.34)" }}
        aria-hidden="true"
      />

      <section className="card-soft relative z-10 w-full max-w-2xl rounded-[var(--r-lg)] bg-(--surface) p-6 text-center sm:p-9">
        <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--blue-50),#ffffff)] text-(--blue-700) shadow-[var(--shadow-xs)] ring-1 ring-(--blue-200)">
          <FiCompass className="text-[1.9rem]" aria-hidden="true" />
        </div>

        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-(--blue-700) sm:text-sm">
          404
        </p>

        <h1 className="mb-3 text-2xl font-extrabold leading-tight text-(--text-strong) sm:text-3xl">
          الصفحة غير موجودة
        </h1>

        <p className="mx-auto max-w-xl text-sm leading-8 text-(--text-muted) sm:text-base">
          يبدو أن الرابط الذي فتحته غير صحيح أو أن الصفحة قد تم نقلها. يمكنك
          العودة إلى الصفحة الرئيسية ومتابعة الاستبيان من هناك.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent bg-(--blue-600) px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(74,134,198,0.18)] transition-all duration-200 hover:bg-(--blue-700) hover:shadow-[0_8px_18px_rgba(74,134,198,0.22)] active:scale-[0.98] sm:text-base"
          >
            <FiHome aria-hidden="true" />
            <span>العودة للرئيسية</span>
          </Link>

          <Link
            href="/"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-(--border) bg-white px-6 py-3 text-sm font-semibold text-(--text-body) shadow-[var(--shadow-xs)] transition-all duration-200 hover:border-(--blue-300) hover:bg-(--blue-50) active:scale-[0.98] sm:text-base"
          >
            <FiArrowRight aria-hidden="true" />
            <span>ابدأ من جديد</span>
          </Link>
        </div>
      </section>
    </main>
  );
}