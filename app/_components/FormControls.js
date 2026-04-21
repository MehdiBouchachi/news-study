import { FiAlertTriangle, FiCheck } from "react-icons/fi";

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
    <div className="card-soft rounded-md border border-(--border) p-4 sm:p-5">
      <p className="mb-4 text-right text-sm font-semibold leading-8 text-(--text-strong) sm:text-[1rem]">
        {text} <span className="text-(--error)">*</span>
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-2.5">
        {(labels || []).map((label, index) => {
          const optVal = String(index + 1);
          const selected = value === optVal;

          return (
            <label
              key={optVal}
              className={cn(
                "group relative flex min-h-[74px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border px-3 py-3 text-center transition-all duration-200",
                "hover:border-(--blue-300) hover:bg-(--blue-50)",
                "focus-within:ring-2 focus-within:ring-(--blue-200) focus-within:ring-offset-1",
                selected
                  ? "border-(--blue-600) bg-(--blue-50)"
                  : "border-(--border) bg-white",
              )}
              style={{
                boxShadow: selected
                  ? "0 0 0 2px rgba(102,163,218,0.12), var(--shadow-xs)"
                  : "var(--shadow-xs)",
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

              <div
                className={cn(
                  "relative flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-200",
                  selected
                    ? "border-(--blue-600) bg-white"
                    : "border-(--border-strong) bg-white group-hover:border-(--blue-400)",
                )}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-200",
                    selected
                      ? "scale-100 bg-(--blue-600) opacity-100"
                      : "scale-50 bg-(--blue-500) opacity-0",
                  )}
                />
              </div>

              <span
                className={cn(
                  "text-sm leading-6 sm:text-xs sm:leading-tight",
                  selected
                    ? "font-semibold text-(--blue-900)"
                    : "font-medium text-(--text-muted)",
                )}
              >
                {label}
              </span>

              {selected && (
                <span className="pointer-events-none absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-(--blue-500)" />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function LikertGroup({ title, sub, questions, form, onChange, labels }) {
  return (
    <div className="card-soft rounded-md border border-(--border) p-4 sm:p-6">
      {title && (
        <h3 className="mb-1 text-right text-lg font-bold text-(--text-strong) sm:text-xl">
          {title}
        </h3>
      )}

      {sub && (
        <p className="mb-5 max-w-[64ch] text-right text-xs leading-7 text-(--text-muted) sm:text-sm">
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
    <div className="mb-6 overflow-hidden rounded-md border border-(--border) bg-white shadow-(--shadow-sm) sm:mb-7">
      <div className="flex items-center justify-between gap-4 border-b border-(--border) bg-[linear-gradient(135deg,#f8fbff,#eef6fd)] px-4 py-3.5 sm:px-6">
        <span className="text-xs font-semibold text-(--text-muted) sm:text-sm">
          {showReminder
            ? "التقييم البعدي — الخبر 1 من 1"
            : "التقييم القبلي — الخبر 1 من 1"}
        </span>

        <span className="rounded-md border border-(--blue-200) bg-white px-3 py-1 text-xs font-semibold text-(--blue-700)">
          {category}
        </span>
      </div>

      {showReminder && (
        <div className="flex items-center gap-2 border-b border-(--warning-border) bg-(--warning-bg) px-4 py-3 sm:px-6">
          <FiAlertTriangle
            className="shrink-0 text-base text-(--warning)"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-(--warning) sm:text-sm">
            تذكير: المصدر هو {disclosureText}
          </span>
        </div>
      )}

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <h3 className="mb-5 border-r-[3px] border-(--blue-500) pr-3 text-right text-lg font-bold leading-9 text-(--text-strong) sm:text-2xl sm:leading-[2.15rem]">
          {title}
        </h3>

        <div className="mx-auto max-w-[72ch] space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-right text-[0.98rem] leading-9 text-(--text-body) sm:text-[1.03rem]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
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
