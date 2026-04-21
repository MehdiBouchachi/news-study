import {
  FiAlertTriangle,
  FiBookOpen,
  FiCheck,
  FiClock,
  FiInfo,
} from "react-icons/fi";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function RadioGroup({ name, value, onChange, options, columns = 1 }) {
  const colsClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : columns === 4
          ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
          : columns === 5
            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-5"
            : "grid-cols-1";

  return (
    <div className={cn("grid gap-3", colsClass)}>
      {options.map((option) => {
        const selected = value === option;

        return (
          <label
            key={option}
            className={cn(
              "group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-md border px-4 py-3.5 transition-all duration-200",
              "hover:border-(--blue-300) hover:bg-(--blue-50)",
              "focus-within:ring-2 focus-within:ring-(--blue-200) focus-within:ring-offset-1",
              selected
                ? "border-(--blue-600) bg-(--blue-50)"
                : "border-(--border) bg-white",
            )}
            style={{
              boxShadow: selected
                ? "0 0 0 2px rgba(102,163,218,0.14), var(--shadow-xs)"
                : "var(--shadow-xs)",
            }}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={selected}
              onChange={(e) => onChange(name, e.target.value)}
              className="peer sr-only"
            />

            <div
              className={cn(
                "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                selected
                  ? "border-(--blue-600) bg-white"
                  : "border-(--border-strong) bg-white group-hover:border-(--blue-400)",
              )}
            >
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all duration-200",
                  selected
                    ? "scale-100 bg-(--blue-600) opacity-100"
                    : "scale-50 bg-(--blue-500) opacity-0",
                )}
              />
            </div>

            <span
              className={cn(
                "flex-1 text-right text-sm leading-7 transition-colors sm:text-[0.98rem]",
                selected
                  ? "font-semibold text-(--blue-900)"
                  : "font-medium text-(--text-body)",
              )}
            >
              {option}
            </span>

            {selected && (
              <span className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-(--blue-500)" />
            )}
          </label>
        );
      })}
    </div>
  );
}

export function LikertCard({ name, text, value, onChange, labels = [] }) {
  return (
    <div className="rounded-md border border-(--border) bg-white p-4 sm:p-5">
      <p className="mb-4 text-right text-base font-semibold leading-8 text-(--text-strong) sm:text-[1.02rem]">
        {text} <span className="text-(--error)">*</span>
      </p>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-5 sm:gap-3">
        {(labels || []).map((label, index) => {
          const optVal = String(index + 1);
          const selected = value === optVal;

          return (
            <label
              key={optVal}
              className={cn(
                "flex min-h-[72px] cursor-pointer items-center justify-center rounded-md border px-4 py-3 text-center transition-all duration-200",
                "hover:border-(--blue-300) hover:bg-(--blue-50)",
                "focus-within:ring-2 focus-within:ring-(--blue-200) focus-within:ring-offset-1",
                selected
                  ? "border-(--blue-600) bg-(--blue-50)"
                  : "border-(--border) bg-white",
              )}
              style={{
                boxShadow: selected
                  ? "0 0 0 1px rgba(74,134,198,0.10)"
                  : "none",
              }}
            >
              <input
                type="radio"
                name={name}
                value={optVal}
                checked={selected}
                onChange={(e) => onChange(name, e.target.value)}
                className="sr-only"
              />

              <span
                className={cn(
                  "text-sm leading-7 sm:text-[0.94rem]",
                  selected
                    ? "font-bold text-(--blue-900)"
                    : "font-semibold text-(--text-body)",
                )}
              >
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
export function LikertGroup({ title, sub, questions, form, onChange, labels }) {
  return (
    <div className="py-1">
      {title && (
        <h3 className="mb-2 text-right text-[1.35rem] font-bold text-(--text-strong) sm:text-[1.6rem]">
          {title}
        </h3>
      )}

      {sub && (
        <p className="mb-6 text-right text-sm leading-7 text-(--text-muted) sm:text-base">
          {sub}
        </p>
      )}

      <div className="space-y-4">
        {questions.map((q) => (
          <LikertCard
            key={q.key}
            name={q.key}
            text={q.text}
            value={form[q.key]}
            onChange={onChange}
            labels={labels}
          />
        ))}
      </div>
    </div>
  );
}

export function ArticleBlock({
  title,
  category,
  paragraphs,
  showReminder,
  disclosureText,
}) {
  return (
    <article className="mb-8 rounded-md bg-white px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-[78ch]">
        {/* Top meta */}
        <div className="mb-5 flex flex-col gap-3 border-b border-(--border) pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-(--blue-50) px-3 py-1 text-xs font-semibold text-(--blue-700)">
              {category}
            </span>

            <span className="text-xs font-medium text-(--text-muted) sm:text-sm">
              {showReminder ? "إعادة القراءة" : "قراءة أولية"}
            </span>
          </div>

          <span className="text-xs font-medium text-(--text-faint) sm:text-sm">
            {showReminder
              ? "التقييم البعدي — خبر واحد"
              : "التقييم القبلي — خبر واحد"}
          </span>
        </div>

        {/* Reminder */}
        {showReminder && (
          <div className="mb-5 rounded-md border border-(--warning-border) bg-(--warning-bg) px-4 py-3">
            <p className="text-right text-sm leading-7 text-(--warning) sm:text-[0.95rem]">
              <span className="font-semibold">تنبيه:</span> المصدر هو{" "}
              {disclosureText}
            </p>
          </div>
        )}

        {/* Title */}
        <header className="mb-6">
          <div className="mb-3 h-[3px] w-14 rounded-full bg-(--blue-500)" />
          <h3 className="text-right text-[1.3rem] font-bold leading-[1.9] text-(--text-strong) sm:text-[1.8rem] sm:leading-[2.3rem]">
            {title}
          </h3>
        </header>

        {/* Body */}
        <div className="space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={cn(
                "text-right text-[1rem] leading-9 text-(--text-body) sm:text-[1.06rem] sm:leading-10",
                index === 0 && "text-(--text-strong)",
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}

export function CheckOption({ label, checked, onChange }) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer items-start gap-3 overflow-hidden rounded-md border px-4 py-3.5 transition-all duration-200",
        "hover:border-(--blue-300) hover:bg-(--blue-50)",
        "focus-within:ring-2 focus-within:ring-(--blue-200) focus-within:ring-offset-1",
        checked
          ? "border-(--blue-600) bg-(--blue-50)"
          : "border-(--border) bg-white",
      )}
      style={{
        boxShadow: checked
          ? "0 0 0 2px rgba(102,163,218,0.14), var(--shadow-xs)"
          : "var(--shadow-xs)",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />

      <div
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border transition-all duration-200",
          checked
            ? "border-(--blue-600) bg-(--blue-600)"
            : "border-(--border-strong) bg-white group-hover:border-(--blue-400)",
        )}
      >
        <FiCheck
          className={cn(
            "text-[0.7rem] text-white transition-all duration-200",
            checked ? "scale-100 opacity-100" : "scale-75 opacity-0",
          )}
          aria-hidden="true"
        />
      </div>

      <span
        className={cn(
          "flex-1 text-right text-sm leading-7 transition-colors sm:text-[0.98rem]",
          checked
            ? "font-semibold text-(--blue-900)"
            : "font-medium text-(--text-body)",
        )}
      >
        {label}
      </span>

      {checked && (
        <span className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-(--blue-500)" />
      )}
    </label>
  );
}

export function ErrorNotice({ message }) {
  if (!message) return null;

  return (
    <div className="mt-6 flex items-start gap-3 rounded-md border border-(--error-border) bg-(--error-bg) px-4 py-3.5 text-right text-sm text-(--error) shadow-[var(--shadow-xs)] sm:text-base">
      <FiAlertTriangle
        className="mt-0.5 shrink-0 text-base"
        aria-hidden="true"
      />
      <p className="leading-7">{message}</p>
    </div>
  );
}

export function TextField({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "field min-h-11 rounded-md border px-4 py-3 text-sm transition-all duration-200 sm:text-base",
        "focus:ring-2 focus:ring-(--blue-200) focus:ring-offset-1",
      )}
    />
  );
}

export function TextareaField({ value, onChange, placeholder, rows = 6 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "field min-h-28 rounded-md border px-4 py-3 text-sm leading-8 transition-all duration-200 sm:text-base",
        "focus:ring-2 focus:ring-(--blue-200) focus:ring-offset-1",
      )}
      style={{ resize: "vertical" }}
    />
  );
}

export function ConsentChoice({ selected, primary, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring min-h-11 rounded-md border px-4 py-3 text-sm font-semibold transition-all duration-200 sm:px-5 sm:text-base",
        selected ? "text-white" : "text-(--text-body)",
      )}
      style={{
        borderColor: selected
          ? primary
            ? "var(--blue-600)"
            : "var(--error)"
          : "var(--border)",
        background: selected
          ? primary
            ? "linear-gradient(135deg, var(--blue-700), var(--teal-600))"
            : "linear-gradient(135deg, #cf5a51, #b44a43)"
          : "white",
        boxShadow: selected
          ? "0 10px 18px rgba(58,113,170,0.14)"
          : "var(--shadow-xs)",
      }}
    >
      {label}
    </button>
  );
}
