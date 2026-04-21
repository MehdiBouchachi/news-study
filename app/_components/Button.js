import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const variants = {
    primary:
      "border-transparent bg-[linear-gradient(135deg,var(--blue-700),var(--teal-600))] text-white shadow-[0_10px_18px_rgba(58,113,170,0.16)] hover:brightness-105",
    secondary:
      "border-(--border) bg-white text-(--text-body) hover:bg-(--blue-50)",
    danger:
      "border-transparent bg-[linear-gradient(135deg,#cf5a51,#b44a43)] text-white shadow-[0_10px_18px_rgba(180,74,67,0.14)] hover:brightness-105",
    ghost:
      "border-(--border) bg-transparent text-(--text-body) hover:bg-(--blue-50)",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`focus-ring inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold transition-all active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-base ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function PrimaryButton(props) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props) {
  return <Button {...props} variant="secondary" />;
}

export function DangerButton(props) {
  return <Button {...props} variant="danger" />;
}

export function ActionRow({ onPrev, onNext, onSubmit, step, prevDisabled }) {
  return (
    <div className="mt-8 border-t border-(--border) pt-5 sm:mt-10 sm:pt-6">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SecondaryButton onClick={onPrev} disabled={prevDisabled}>
          <span className="inline-flex items-center gap-2">
            <FiArrowRight aria-hidden="true" />
            <span>السابق</span>
          </span>
        </SecondaryButton>
        {onSubmit ? (
          <PrimaryButton onClick={onSubmit}>
            <span className="inline-flex items-center gap-2">
              <FiCheck aria-hidden="true" />
              <span>إنهاء وإرسال</span>
            </span>
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={onNext}>
            <span className="inline-flex items-center gap-2">
              <span>{step === 4 ? "الخبر التالي" : "التالي"}</span>
              <FiArrowLeft aria-hidden="true" />
            </span>
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
