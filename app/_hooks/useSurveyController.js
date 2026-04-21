import { useMemo, useState } from "react";

export function useSurveyController({
  totalSteps,
  disclosureText,
  preQuestions,
  postQuestions,
  sourceTrustQuestions,
  aiReasoningQuestions,
}) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
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
      if (
        !form.gender ||
        !form.age.trim() ||
        !form.level ||
        !form.specialization ||
        !form.internetUsage ||
        !form.aiKnowledge ||
        !form.aiToolsUsage
      ) {
        setError("يرجى تعبئة جميع البيانات المطلوبة.");
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
    if (!validateStep()) return false;
    console.log("PAYLOAD", payload);
    setError("");
    setStep(10);
    return true;
  };

  return {
    step,
    setStep,
    error,
    setError,
    submitted,
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
