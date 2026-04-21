import { useMemo, useState } from "react";

const LIKERT_LABELS = {
  1: "معارض بشدة",
  2: "معارض",
  3: "محايد",
  4: "موافق",
  5: "موافق بشدة",
};

function normalizeDigits(value) {
  return String(value ?? "")
    .replace(/[\u0660-\u0669]/g, (char) => String(char.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (char) => String(char.charCodeAt(0) - 0x06f0));
}

export function useSurveyController({
  totalSteps,
  disclosureText,
  preQuestions,
  postQuestions,
  sourceTrustQuestions,
  aiReasoningQuestions,
}) {
  const likertKeys = useMemo(
    () =>
      [
        ...preQuestions,
        ...postQuestions,
        ...sourceTrustQuestions,
        ...aiReasoningQuestions,
      ].map((question) => question.key),
    [preQuestions, postQuestions, sourceTrustQuestions, aiReasoningQuestions],
  );

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    consent: "",
    gender: "",
    age: "",
    level: "",
    specialization: "",
    internetUsage: "",
    aiKnowledge: "",
    aiToolsUsage: "",
    pre_accuracy: "",
    pre_objective: "",
    pre_share: "",
    post_accuracy: "",
    post_objective: "",
    post_share: "",
    trust_competence_1: "",
    trust_competence_2: "",
    trust_integrity_1: "",
    trust_integrity_2: "",
    trust_benevolence: "",
    ai_reason_1: "",
    ai_reason_2: "",
    ai_reason_3: "",
    ai_reason_4: "",
    ai_reason_5: "",
    ai_reason_6: "",
    futureBehavior: "",
    finalExplanation: "",
    otherFeelingText: "",
  });
  const [feelings, setFeelings] = useState([]);
  const [attentionFlag] = useState(false);

  const payload = useMemo(
    () => ({
      ...form,
      feelings,
      disclosure: disclosureText,
      completed: submitted,
    }),
    [form, feelings, submitted, disclosureText],
  );

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const toggleFeeling = (label) =>
    setFeelings((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  const checkLikertGroup = (questions) =>
    questions.every((question) => form[question.key] !== "");

  const validateStep = () => {
    if (step === 1) {
      if (!form.consent) {
        setError("يرجى اختيار الموافقة أو الرفض للمتابعة.");
        return false;
      }
      if (form.consent === "no") {
        setSubmitted(true);
        return false;
      }
      return true;
    }

    if (step === 2) {
      const normalizedAge = normalizeDigits(form.age.trim());

      if (
        !form.gender ||
        !normalizedAge ||
        !form.level ||
        !form.specialization ||
        !form.internetUsage ||
        !form.aiKnowledge ||
        !form.aiToolsUsage
      ) {
        setError("يرجى تعبئة جميع البيانات المطلوبة.");
        return false;
      }

      if (!/^\d+$/.test(normalizedAge)) {
        setError("يرجى إدخال السن بالأرقام فقط.");
        return false;
      }

      return true;
    }

    if (step === 4 && !checkLikertGroup(preQuestions)) {
      setError("يرجى الإجابة عن جميع عبارات تقييم الخبر.");
      return false;
    }

    if (step === 6 && !checkLikertGroup(postQuestions)) {
      setError("يرجى استكمال التقييم البعدي.");
      return false;
    }

    if (step === 7 && !checkLikertGroup(sourceTrustQuestions)) {
      setError("يرجى الإجابة عن جميع عبارات قياس الثقة في المصدر.");
      return false;
    }

    if (step === 8 && !checkLikertGroup(aiReasoningQuestions)) {
      setError("يرجى الإجابة عن جميع عبارات مقياس الاستدلال الآلي.");
      return false;
    }

    if (step === 9) {
      if (
        feelings.length === 0 ||
        !form.futureBehavior ||
        !form.finalExplanation.trim()
      ) {
        setError("يرجى استكمال هذا القسم قبل الإنهاء.");
        return false;
      }
      if (
        feelings.includes("أخرى (يرجى تحديد شعورك بدقة)") &&
        !form.otherFeelingText.trim()
      ) {
        setError("يرجى توضيح خيار (أخرى).");
        return false;
      }
    }

    return true;
  };

  const next = () => {
    if (!validateStep()) return false;
    setError("");
    setStep((prev) => Math.min(totalSteps, prev + 1));
    return true;
  };

  const prev = () => {
    setError("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const submit = () => {
    if (!validateStep() || isSubmitting) return false;

    const run = async () => {
      setIsSubmitting(true);
      setError("");

      try {
        const normalizedAge = normalizeDigits(form.age.trim());
        const formWithLikertText = {
          ...form,
          age: normalizedAge,
        };

        for (const key of likertKeys) {
          formWithLikertText[key] = LIKERT_LABELS[form[key]] || form[key];
        }

        const submissionData = {
          ...formWithLikertText,
          feelings,
          disclosure: disclosureText,
          completed: true,
          submitted_at: new Date().toISOString(),
        };

        const res = await fetch("/api/survey-submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        });

        if (!res.ok) {
          throw new Error("Submission failed");
        }

        setSubmitted(true);
        setStep(10);
      } catch {
        setError("تعذر إرسال الاستبيان حالياً. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsSubmitting(false);
      }
    };

    void run();
    return true;
  };

  return {
    step,
    setStep,
    error,
    setError,
    submitted,
    isSubmitting,
    form,
    feelings,
    attentionFlag,
    payload,
    updateField,
    toggleFeeling,
    next,
    prev,
    submit,
    validateStep,
    checkLikertGroup,
    setFeelings,
  };
}
