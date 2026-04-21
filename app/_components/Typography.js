export function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-7 text-right sm:mb-8">
      {eyebrow && (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-(--blue-200) bg-(--blue-50) px-3 py-1 text-xs font-semibold tracking-wide text-(--blue-700)">
          {eyebrow}
        </div>
      )}
      <h2 className="text-[1.45rem] font-bold leading-snug text-(--text-strong) sm:text-[1.75rem] lg:text-[1.95rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-[64ch] text-sm leading-8 text-(--text-muted) sm:text-[1.02rem]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function FieldLabel({ children, required, hint }) {
  return (
    <p className="mb-3 text-right text-[0.95rem] font-semibold leading-8 text-(--text-strong) sm:text-[1rem]">
      {children}
      {required && <span className="mr-1 text-(--error)">*</span>}
      {hint && (
        <span className="mr-2 text-sm font-normal text-(--text-muted)">
          {hint}
        </span>
      )}
    </p>
  );
}
