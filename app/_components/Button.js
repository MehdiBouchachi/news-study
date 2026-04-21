import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const variants = {
    primary: cn(
      "border-transparent text-white",
      "bg-(--blue-600)",
      "shadow-[0_6px_14px_rgba(74,134,198,0.18)]",
      "hover:bg-(--blue-700)",
      "hover:shadow-[0_8px_18px_rgba(74,134,198,0.22)]",
      "active:bg-(--blue-800)",
    ),

    secondary: cn(
      "border-(--border)",
      "bg-white",
      "text-(--text-body)",
      "shadow-[var(--shadow-xs)]",
      "hover:border-(--blue-300)",
      "hover:bg-(--blue-50)",
    ),

    danger: cn(
      "border-transparent text-white",
      "bg-[var(--error)]",
      "shadow-[0_6px_14px_rgba(192,75,68,0.16)]",
      "hover:bg-[#a63f38]",
      "active:bg-[#8e342f]",
    ),

    ghost: cn(
      "border-transparent",
      "bg-transparent",
      "text-(--text-body)",
      "hover:bg-(--blue-50)",
    ),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2",
        "rounded-md border px-5 py-3 text-sm font-semibold",
        "transition-all duration-200",
        "active:scale-[0.97]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "sm:px-6 sm:text-base",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ===============================
   SHORTCUT BUTTONS
================================= */

export function PrimaryButton(props) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props) {
  return <Button {...props} variant="secondary" />;
}

export function DangerButton(props) {
  return <Button {...props} variant="danger" />;
}

/* ===============================
   ACTION ROW
================================= */

export function ActionRow({
  onPrev,
  onNext,
  onSubmit,
  step,
  prevDisabled,
  isSubmitting = false,
}) {
  return (
    <div className="mt-8 border-t border-(--border) pt-5 sm:mt-10 sm:pt-6">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SecondaryButton
          onClick={onPrev}
          disabled={prevDisabled || isSubmitting}
        >
          <FiArrowRight />
          <span>السابق</span>
        </SecondaryButton>

        {onSubmit ? (
          <PrimaryButton onClick={onSubmit} disabled={isSubmitting}>
            <FiCheck />
            <span>{isSubmitting ? "جارٍ الإرسال..." : "إنهاء وإرسال"}</span>
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={onNext} disabled={isSubmitting}>
            <span>{step === 4 ? "الخبر التالي" : "التالي"}</span>
            <FiArrowLeft />
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
